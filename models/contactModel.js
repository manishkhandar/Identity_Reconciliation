const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// MySQL connection configuration
const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
  dialect: 'postgres'
});

// Define the Contact model
const Contact = sequelize.define(
	'contacts',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		phonenumber: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		linkedid: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		linkprecedence: {
			type: DataTypes.STRING,
			defaultValue: 'primary'
		},
		createdat: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		},
		updatedat: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
		},
		deletedat:{
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null
		}
	},
	{
		createdAt: false,
		updatedAt: false,
	}
);

// Create the Contact table if it doesn't exist
Contact.sync();

class ContactModel {
	static async createContact(fields) {
		try {
			console.log('fields', fields)
			const contact = await Contact.create(fields);
			console.log('Contact created:', contact.toJSON());
			return contact;
		} catch (error) {
			console.error('Error creating contact:', error);
			throw error;
		}
	}

	static async get(filter, order) {
		try {
			console.log('**************Contact**********', Contact)
			const contacts = await Contact.findAll({
				where: filter,
				order: order
			});
			return contacts.map((contact) => contact.toJSON());
		} catch (error) {
			console.error('Error retrieving contacts:', error);
			throw error;
		}
	}

	static async getContactById(contactId) {
		try {
			const contact = await Contact.findByPk(contactId);
			if (!contact) {
				throw new Error(`Contact with ID ${contactId} not found.`);
			}
			console.log('Contact:', contact.toJSON());
			return contact;
		} catch (error) {
			console.error('Error retrieving contact:', error);
			throw error;
		}
	}

	static async updateContact(fields, filter) {
		try {
			const [rowsAffected] = await Contact.update(
				fields,
				filter
			);
			console.log('Contact updated:', rowsAffected);
			return rowsAffected;
		} catch (error) {
			console.error('Error updating contact:', error);
			throw error;
		}
	}

	static async deleteContact(contactId) {
		try {
			const rowsAffected = await Contact.destroy({
				where: { id: contactId },
			});
			console.log('Contact deleted:', rowsAffected);
			return rowsAffected;
		} catch (error) {
			console.error('Error deleting contact:', error);
			throw error;
		}
	}
}

module.exports = ContactModel;
