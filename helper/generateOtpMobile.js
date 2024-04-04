function generateOTPMobile() {

    const otp = Math.floor(1000 + Math.random() * 9000);

    return otp
}

//otp Expiry time

function mobileOtpExpiryTime() {
    const otpExpires = new Date();
    otpExpires.setSeconds(otpExpires.getSeconds() + 30000);


    return otpExpires
}
module.exports = {
    generateOTPMobile,
    mobileOtpExpiryTime
}