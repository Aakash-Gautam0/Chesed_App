const nodemailer = require('nodemailer')

exports.autoMail = async (to, subject, text) => {
  //Nodemailer TRANSPORTER
 
  const transporter = nodemailer.createTransport({
    // host: process.env.EHOST,
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
      user: 'aakash.gautam@quytech.com',
      pass: 'lryd czdd kkia ynvy '
     
    }
  })
  //Nodemailer OPTIONS
  
  var mailOptions = {
    from: '"otp for signup " <aakashgautam@quytech.com>',
    to: to, 
    subject: subject,
    text: text
};
  transporter.verify(function(error, success) {
    if (error) {
          console.log(error);
    } else {
          console.log('Server is ready to take our messages');
    }
  });
  
  //Sending EMAIL
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(`Cannot send email >>> ${err.message}`);
      
    } else {
      console.log(`Email sent successfully: ${info.response}`);
    }
  })
}

