const twilio = require('twilio');

// Twilio credentials
const accountSid = 'AC0eaeaab6483ea1c392f3198f48b597f7';
const authToken = '4a3fa46159360f9961b98a12105a9a7f';
const twilioPhoneNumber = '+12564606750';

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Function to send OTP via SMS
function sendOTPMobile(mobileNumber, mobileOtp) {
    return client.messages.create({
        body: `Your OTP is: ${mobileOtp}`,
        to: mobileNumber,
        from: twilioPhoneNumber
    });
}

module.exports = {
    sendOTPMobile
}

