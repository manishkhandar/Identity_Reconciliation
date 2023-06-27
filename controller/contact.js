const ContactModel = require('../models/contactModel')
const { Sequelize, Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash')


function generateUniqueInt() {
	const uuid = uuidv4();
	const uuidWithoutHyphens = uuid.replace(/-/g, '');
	const uuidSubstring = uuidWithoutHyphens.substring(0, 4);
	const uniqueInt = parseInt(uuidSubstring, 16);
	return uniqueInt
}

exports.createContact = async (req, res) => {
	const { email, phoneNumber} = req.body;
	console.log(email, phoneNumber)

	try {
		// Check if contact with the same email or phoneNumber already exists
		let filter, fields, order
		filter = {
			[Op.or]: [{ email }, { phonenumber: phoneNumber }],
		}
		order = [['createdat', 'ASC']]
		const existingContacts = await ContactModel.get(filter, order);

		if (existingContacts.length > 0) {
		// Update the oldest entry's linkPrecedence to "primary" and others to "secondary"
			const oldestContact = existingContacts[0];
			const oldestContactId = oldestContact.id;

			fields = {
				linkprecedence: 'secondary',
				linkedid: oldestContactId,
				updatedat : Sequelize.literal('CURRENT_TIMESTAMP'),
			}
			filter = {
				where: {
					[Sequelize.Op.and]: [
						{ [Op.or]: [{ email }, { phonenumber: phoneNumber }] },
						{ id: { [Op.not]: oldestContactId } },
					],
				}
			},
			await ContactModel.updateContact(fields, filter);

			if(existingContacts.length == 1) {

				await ContactModel.createContact({
					id : generateUniqueInt(),
					phonenumber: phoneNumber,
					email,
					linkedid: oldestContactId,
					linkprecedence: 'secondary'
				});
			}


		} else {
		// Create a new contact with linkPrecedence as "primary"
			await ContactModel.createContact({
				id : generateUniqueInt(),
				phonenumber: phoneNumber,
				email,
			});
		}

		return res.status(200).json({ message: 'Contact added successfully' });
	} catch (error) {
		console.error('Error adding contact:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};


exports.identifyContact = async (req, res) => {
	try {
		const phoneNumber = req.body.phoneNumber || null;
		const email = req.body.email || null
		let filter, order
		order = [['createdat', 'ASC']]

		//primary contact
		filter = {
			linkprecedence: 'primary',
			[Op.or]: [
				{ email },
				{ phonenumber :phoneNumber }
			]
		}
		const primaryContact = await ContactModel.get(filter, order);

		if(primaryContact.length === 0) {
			return res.status(404).json({message : "No order details found for this contacts"})
		}

		//Linked contacts
		filter = {
			linkedid: primaryContact[0].id,
		}
		const LinkedContacts = await ContactModel.get(filter, order);

		const emails = _.uniq(LinkedContacts.map(obj => obj.email));
		const phoneNumbers = _.uniq(LinkedContacts.map(obj => obj.phonenumber));
		const secondaryIds = _.uniq(LinkedContacts.map(obj => obj.id));

		let response =
		{
			"contact":{
				"primaryContatctId": primaryContact[0].id,
				"emails": _.union( [primaryContact[0].email] ,emails),
				"phoneNumbers": _.union ([primaryContact[0].phonenumber], phoneNumbers),
				"secondaryContactIds": secondaryIds
			}
		}

		return res.status(200).json(response);
	} catch (error) {
		console.error('Error identifying contact(s):', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};
