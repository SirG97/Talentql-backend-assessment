const express = require('express')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')


//enable access to environment Variables
dotenv.config();

const app = express();

const limiter = rateLimit({
    windowMs:   600000, // 3 sec
    max: 3, // limit each IP to 3 requests per secs
    message: 'Too many requests from this IP, please try again after 3 seconds'
});

//  apply to all requests
app.use(limiter);


app.get("/howold/:dob", (req, res) => {

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

