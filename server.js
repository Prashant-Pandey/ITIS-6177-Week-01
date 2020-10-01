const express = require('express'),
    app = express();
require('dotenv').config();
const router = require('./router');
const port = process.env.port || 3000;

app.use(express.urlencoded({
    extended: true
}));


app.use(express.json());

app.get('/', (req, res)=>{
    res.json({
        links:{
            API_DOCUMENTATION:'/api/v1/'
        }
    })
})

app.use('/api/v1/', router);


app.listen(port, () => {
    console.log('listen to the port 3000');
});

