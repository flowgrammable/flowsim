  5) Set up the mailer config file

    Remaining in the base 'flowsim/' directory, run the following command:

    > echo "module.exports = { service: 'gmail', auth: { user: '<your email>', pass: '<your password>' } }" > src/backend/mailer/config.js

    replacing <your email> with a valid gmail account and <your password>
    with the password for that account
