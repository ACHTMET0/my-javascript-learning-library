const { transports, createLogger, format } = require("winston");
const { combine, timestamp, prettyPrint } = format;
const config = require("config");
require("winston-mongodb");

const username = config.get("db.username");
const password = config.get("db.password");
const database = config.get("db.name");

const logger = createLogger({
    level: "error",
    // format: winston.format.json(),
    format: combine(
        timestamp({
            format: "MMM-DD-YYYY HH:mm:ss"
        }),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/logs.log", level: "error", maxFiles: "30m" }),
        new transports.File({ filename: "logs/exceptions.log", level: "error", handleExceptions: true, handleRejections: true, maxFiles: "30m" }),
        new transports.MongoDB({
            level: 'error',
            db: `mongodb+srv://${username}:${password}@cluster0.bq56f.mongodb.net/${database}?retryWrites=true&w=majority&appName=Cluster0`,
            collection: "server_logs"
        })
    ],
});

// process.on("uncaughtException", (error) => {
//     console.log(error.message);
//     // logger.error(error.message);
// });

// process.on("unhandledRejection", (error) => {
//     console.log(error.message);
// });

module.exports = logger;