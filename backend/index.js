const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const userController = require('./Controllers/UserController');

app.use(cors());
app.use(bodyParser.json());
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));

app.use('/api', userController);
app.get('/', (req, res) => {
    res.send('Hello World');
});

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});