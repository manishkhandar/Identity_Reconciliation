# Identity_Reconciliation
 Identify and keep track of a customer's identity across multiple purchases.

## API Call and Request Example
to add order (contact)


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

to identify 

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
