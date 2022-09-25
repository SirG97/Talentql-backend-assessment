const express = require('express');
const rateLimit = require('express-rate-limit');
const { config } = require('dotenv');
const cors = require('cors');

const { validationResult, check } = require('express-validator');

//enable access to environment Variables
config();

const app = express();

app.set('trust proxy', 1)
// adds middleware for cross-origin resource sharing configuration
app.use(cors());

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json());


const PORT = process.env.PORT || 3000;
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 3,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
        status: 'error',
        error: 'Too many requests, please try again later.'
    });
    
    }, 
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,

});
// apply to all requests

app.use(limiter);
const validateDob = (req, res, next) => {
    const { query: { dob } } = req; //destructure dob from query params

    if(!dob) {
        return res.status(400).json({
            status: 'error',
            error: 'Date of Birth is missing'
        });
    }

    const date = new Date(Number(dob));
    if(isNaN(date.getTime())){
        return res.status(400).json({
            status: 'error',
            error: 'please enter a valid date of birth in milliseconds'
        });
       
    }
    req.validDob = date;
    next();
}

app.get("/", (req, res) => {
    res.status(200)
       .send("Welcome to TalentQL Backend Assessment API")
})
// check("dob").notEmpty().isDate()
app.get("/howold", validateDob, async(req, res) => {

    let today = new Date();
   
    let currentYearInMilliseconds = today.getTime();
    let oneYearInMilliseconds = 1000 * 60 * 60 * 24 * 365;
    if(req.validDob > currentYearInMilliseconds){
        return res.status(400).json({ error: "Date of birth can't be more than the current year"});
    }
    let age = Math.round((currentYearInMilliseconds - req.validDob)/oneYearInMilliseconds);
    return res.status(200).send({ message: "age calculated successfully", age: age});
  
});
app.use('*', (req, res)=>res.send('Route does not exist'))
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

