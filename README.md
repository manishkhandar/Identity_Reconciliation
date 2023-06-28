# Identity_Reconciliation
 Identify and keep track of a customer's identity across multiple purchases.

## API Call and Request Example
 ### To add order (contact):`/add-contact`

- **Description**: Add contact details.
- **Method**: POST
- **Parameters**:
  - `email` (optional): email.
  - `phoneNumber` (optional): phoneNumber.

```javascript
curl --location 'https://identity-al5n.onrender.com/add-contact/' \
--header 'Content-Type: application/json' \
--data '{
    "email": "abc@gmail.com",
    "phoneNumber":"1234567809"
}'
```

```javascript
response:
{
    "message": "Contact added successfully"
}
```

 ### To identify  (contact):`/identify`

- **Description**: Identify contact details.
- **Method**: POST
- **Parameters**:
  - `email` (optional): email.
  - `phoneNumber` (optional): phoneNumber.

```javascript
curl --location 'https://identity-al5n.onrender.com/identify/' \
--header 'Content-Type: application/json' \
--data '{
    "email": "abc@gmail.com",
    "phoneNumber":"1234567809"
}'
```
```javascript
response:
{
    "contact": {
        "primaryContatctId": 41461,
        "emails": ["a", "c"],
        "phoneNumbers": ["1", "3"],
        "secondaryContactIds": [58907,4266]
    }
}
```

## To run the server on localhost
* Close the repository
* Run `npm i` to install dependency
* Create a __.env__ file in the root directory
* Add `CONNECTION_STRING = postgres://username:password@localhost:5432/mydatabase` to .env file
* Run `npm start` to start the server
