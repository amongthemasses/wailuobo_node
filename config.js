const path = require("path");

module.exports = {
    port: 8000,
    static: path.join(__dirname, "/public"),
    uploadsDir: path.join(__dirname, '/public/uploads'),
    responseCode: {
        success: 200,
        missingFile: 300,
        error: 400,
        missingParameter: 401,
        invalidAccessToken: 402,
        invalidRefreshToken: 403,

    },
    cors: {
        origin: "*",
        credentials: true
    },
    mysql: {
        user: "wailuobo",
        password: "123456",
        host: "127.0.0.1",
        port: "3306",
        database: "wailuobo",
        connectionLimit: 10,
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    auth: {
        secretKey: "abc123",
        refreshExpiresIn: "30d",
        accessExpiresIn: "15m"
    }
}