const express = require('express')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')
const {  validationResult, check } = require('express-validator');

//enable access to environment Variables
dotenv.config();

const app = express();
app.use(express.json());
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs:   1000, // 3 sec
    max: 3, // limit each IP to 3 requests per secs
    message: 'Too many requests from this IP, please try again after 3 seconds',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//  apply to all requests
app.use(limiter);


app.get("/howold", check('dob').notEmpty().isDate(), async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ error: `${
            errors.array()[0]['msg']}, please enter a valid date of birth in the format YYYY-MM-DD.`, });
        }

        var today = new Date();
    
        let dob = new Date(req.query.dob);
        // Get date of birth and extract month and year
        let yearOfBirthInMilliseconds = dob.getTime();
        let currentYearInMilliseconds = today.getTime();
        let oneYearInMilliseconds = 1000 * 60 * 60 * 24 * 365;

        if(yearOfBirthInMilliseconds > currentYearInMilliseconds){
            return res.status(400).json({ error: `Date of birth can't be more than the current year`, });
        }
        let age = Math.round((currentYearInMilliseconds - yearOfBirthInMilliseconds)/oneYearInMilliseconds)
        
        return res.status(200).send({'age': age});
    } catch (error) {
        res.status(500).json(error);
    }

});

const PORT = process.env.port || 3000

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
});

