
exports.connection_string = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
};

exports.response400 = (res) => {
    res.status(400)
    res.json({
        error: 'Validate user input'
    });
}

exports.response500 = (res, error) => {
    res.status(500)
    res.json({
        error
    });
}

exports.response = (res, status, type, message) => {
    res.status(status);
    const response = {}
    response[type] = message
    res.json(response);
}

