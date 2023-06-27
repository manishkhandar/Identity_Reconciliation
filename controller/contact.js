const ContactModel = require('../models/contactModel')
const { Sequelize, Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');


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