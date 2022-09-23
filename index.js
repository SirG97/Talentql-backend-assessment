import express, { json, urlencoded } from 'express';
import rateLimit, { MemoryStore } from 'express-rate-limit';
import dotenv from 'dotenv';
import cors from 'cors';
// import requestIP from 'request-ip';
// import nodeCache from 'node-cache';
// import {isIP, isIPv4, isIPv6} from 'is-ip';
import { validationResult, check } from 'express-validator';

//enable access to environment Variables
dotenv.config();

const app = express();
// adds middleware for cross-origin resource sharing configuration
app.use(cors());


app.use(json());
app.use(urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// const TIME_FRAME_IN_S = 10;
// const TIME_FRAME_IN_MS = TIME_FRAME_IN_S * 1000;
// const MS_TO_S = 1 / 1000;
// const RPS_LIMIT = 2;

const PORT = process.env.PORT || 3000;
const limiter = rateLimit({
  windowMs: 1 * 1000, // 1 second
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
// const ipMiddleware = async function (req, res, next) {
//     let clientIP = requestIP.getClientIp(req);
//     if (isIPv6(clientIP)) {
//         clientIP = clientIP.split(':').splice(0, 4).join(':') + '::/64';
//     }
   
//     updateCache(clientIP);
//     const IPArray = IPCache.get(clientIP);
//     if (IPArray.length > 1) {
//         const rps = IPArray.length / ((IPArray[IPArray.length - 1] - IPArray[0]) * MS_TO_S);
//         if (rps > RPS_LIMIT) {
//             return res.status(429).json({
//                             status: 'error',
//                             error: 'Too many requests, please try again later.'
//                         });
//             console.log('You are hitting limit', clientIP);
//         }
//     }
//     next();
// };
// app.use(ipMiddleware);

// const IPCache = new nodeCache({ stdTTL: TIME_FRAME_IN_S, deleteOnExpire: false, checkperiod: TIME_FRAME_IN_S });
// IPCache.on('expired', (key, value) => {
//     if (new Date() - value[value.length - 1] > TIME_FRAME_IN_MS) {
//         IPCache.del(key);
//     }else {
//         const updatedValue = value.filter(function (element) {
//             return new Date() - element < TIME_FRAME_IN_MS;
//         });
//         IPCache.set(key, updatedValue, TIME_FRAME_IN_S - (new Date() - updatedValue[0]) * MS_TO_S);
//     }

// });

// const updateCache = (ip) => {
//     let IPArray = IPCache.get(ip) || [];
//     IPArray.push(new Date());
//     IPCache.set(ip, IPArray, (IPCache.getTtl(ip) - Date.now()) * MS_TO_S || TIME_FRAME_IN_S);
// };

app.get("/", (req, res) => {
    res.status(200)
       .send("Welcome to TalentQL Backend Assessment API")
})
app.get("/howold", limiter, check("dob").notEmpty().isDate(), async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: `${errors.array()[0]["msg"]}, please enter a valid date of birth in the format YYYY-MM-DD.`});
    }
    let today = new Date();
    let dob = new Date(req.query.dob);// Get date of birth and extract month and year
    let yearOfBirthInMilliseconds = dob.getTime();
    let currentYearInMilliseconds = today.getTime();
    let oneYearInMilliseconds = 1000 * 60 * 60 * 24 * 365;
    if(yearOfBirthInMilliseconds > currentYearInMilliseconds){
        return res.status(400).json({ error: "Date of birth can't be more than the current year"});
    }
    let age = Math.round((currentYearInMilliseconds - yearOfBirthInMilliseconds)/oneYearInMilliseconds);
    return res.status(200).send({ message: "age calculated successfully", age: age});
  
});
app.use('*', (req, res)=>res.send('Route does not exist'))
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

