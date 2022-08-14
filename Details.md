[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3fe396989c724a329dbafaaacbea174a)](https://www.codacy.com/gh/SirG97/Talentql-backend-assessment/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=SirG97/Talentql-backend-assessment&amp;utm_campaign=Badge_Grade)

# Age Calculator

Design and implementation
The api is built using node and express js. I used express-rate-limit package implement rate limiting to restrict calls to the api per ip. I aslo used express-validator to validate the expected query param (dob).
No particular design pattern was followed as I wanted to keep it short a simple.



How to get started
1.  Clone the repo
2.  Run 'npm install'
3.  Open your terminal, navigate into the repo and run 'node index.js'

How it works
Send a get request to http://localhost:{PORT}/howold?dob={YYYY-MM-DD} where YYYY-MM-DD is is a valid timestamp. The result will be calculated and returned

