const express = require('express')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')


//enable access to environment Variables
dotenv.config();

const app = express();
app.set('trust proxy', 2);
const limiter = rateLimit({
    windowMs:   1000, // 3 sec
    max: 3, // limit each IP to 3 requests per secs
    message: 'Too many requests from this IP, please try again after 3 seconds',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


//  apply to all requests
app.use(limiter);

app.get('/ip', (request, response) => response.send(request.ip))
app.get("/howold/:dob",limiter,(req, res) => {

    if(!Date.parse(req.params.dob)){
        return res.status(400).send({"message": "Invalid date provided"});

    }
    var today = new Date();

    let dob = new Date(req.params.dob);
    // Get date of birth and extract month and year
    let yearOfBirth = dob.getFullYear()
    let monthOfBirth = dob.getMonth()

    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
 
    let age = currentYear - yearOfBirth;
    let m = currentMonth - monthOfBirth;

    if(m < 0 || (m === 0 && today.getDate() < dob.getDate())){
        age--
    }

    return res.send({'age': age, "yob": req.params.dob, "monthDiff":m});
});

const PORT = process.env.port || 3000

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
});

