const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

const port = process.env.PORT || 8080;

app.listen(port , () => {
	console.info(`app is listening to port :${port}`);
});