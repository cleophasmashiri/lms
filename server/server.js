import express from 'express';
import cors from 'cors';
import { readdirSync } from 'fs';
import mongoose from 'mongoose';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const csrfProtection = csrf({ cookie: true });

const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('DB connected'))
    .catch((err) => console.log('DB Connection error: ', err));
// useFindAndModify: false,
// useCreateIndex: true

// apply middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log('This is middleware');
    next();
});

// routing
readdirSync('./routes')
    .map((r) => app.use('/api', require(`./routes/${r}`))
    );

app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
    res.json({csrfToken: req.csrfToken()})
});

// port
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
