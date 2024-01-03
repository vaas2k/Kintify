const dotenv = require('dotenv').config();

const CLOUD_NAME = process.env.cloud_name;
const API_KEY = process.env.api_key;
const API_SECRET = process.env.api_secret;

const MONGO_DB = process.env.mongo_db;

const ACCESS_TOK = process.env.access;
const REFRESH_TOK = process.env.refresh;

const PORT = process.env.port

module.exports = {
    CLOUD_NAME,
    API_KEY,
    API_SECRET,
    MONGO_DB,
    ACCESS_TOK,
    REFRESH_TOK,
    PORT
};