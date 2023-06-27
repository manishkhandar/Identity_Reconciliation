const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const { Pool } = require('pg');
const routes = require('./routes')
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use("/", routes.contact)

const connectionString = process.env.CONNECTION_STRING
const pool = new Pool({
	connectionString: connectionString,
});

pool.connect((err, client, release) => {
	if (err) {
		console.error(`Error connecting to the database for ${client}`, err);
		return;
	}
	console.log('Successfully connected to the database');
	release();
});

pool.on('error', (err, client) => {
	console.error(`Unexpected error on idle client: ${client} `, err);
	process.exit(-1);
});
const port = process.env.PORT || 8080;

app.listen(port , () => {
	console.info(`app is listening to port :${port}`);
});