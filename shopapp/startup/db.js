const mongoose = require('mongoose');
const logger = require("./logger");
const config = require("config");

const username = config.get("db.username");
const password = config.get("db.password");
const database = config.get("db.name");

module.exports = function () {
    mongoose
        .connect(`mongodb+srv://${username}:${password}@cluster0.bq56f.mongodb.net/${database}?retryWrites=true&w=majority&appName=Cluster0`)
        .then(() => logger.info("MongoDB bağlantısı kuruldu"));
}