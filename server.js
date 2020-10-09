const express = require('express'),
    app = express(),
    swaggerJSDoc = require("swagger-jsdoc")
swaggerUI = require('swagger-ui-express');
require('dotenv').config();
const router = require('./router');
app.use(require('cors')());
const port = process.env.port || 3000;

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Company API',
            version: '1.0.0',
            description: 'API for company listing'
        },
        host: 'localhost:3000',
        basePath: '/'
    },
    apis: [
        './router.js',
        './companyRouter.js'
    ]
};

const specs = swaggerJSDoc(swaggerOptions);

app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.urlencoded({
    extended: true
}));


app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        links: {
            API_DOCUMENTATION: '/api/v1/docs'
        }
    })
})

app.use('/api/v1/', router);


app.listen(port, () => {
    console.log('listen to the port 3000');
});

