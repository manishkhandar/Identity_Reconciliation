const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const { Pool } = require('pg');
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

const connectionString = process.env.CONNECTION_STRING
const pool = new Pool({
	connectionString: connectionString,
});

pool.connect((err, client, release) => {
	if (err) {
		console.error('Error connecting to the database', err);
		return;
	}
	console.log('Successfully connected to the database');
	release();
});

pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1);
});
const port = process.env.PORT || 8080;

app.listen(port , () => {
	console.info(`app is listening to port :${port}`);
});