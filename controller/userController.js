const userModel = require("../model/userModel")
const mailer = require("../helper/otpEmail")
const { generateOTPEmail, emailOtpExpiryTime } = require("../helper/generateOtpEmail")
const { generateOTPMobile, mobileOtpExpiryTime } = require("../helper/generateOtpMobile")
const phoneotp = require("../helper/otpMobileNo")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

const authenticateToken = require('../middlewares/userAuth');
const { use } = require("passport")


exports.signup = async (req, res) => {
    try {
        const { name, email, gender, mobileNumber, password } = req.body;
        const userExist = await userModel.findOne({ email: email })
        if (userExist) {
            return res.send({ message: "User already registered" })
        } else {
            if (req.body.password != req.body.confirmPassword) {
                return res.send({ responseMessage: "Password and confirm password do not match" })
            }
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);



        //      for email otp

        const emailOtp = generateOTPEmail()
        const OtpExpires = emailOtpExpiryTime()

        let subject = `Signup OTP`;
        let text = `Your OTP for signup is : ${emailOtp}`;
        await mailer.autoMail(email, subject, text);



        //       for mobile otp
        let mobileOtp, mobileOtpExpiry;
        if (mobileNumber) {
            mobileOtp = generateOTPMobile();
            mobileOtpExpiry = mobileOtpExpiryTime();
            await phoneotp.sendOTPMobile(mobileNumber, mobileOtp);
        }

        let profilePic;
        if (req.file) {
            // Handle profile picture upload
            profilePic = req.file.path;
        }
        const user = new userModel({
            name,
            email,
            gender,
            mobileNumber,
            emailOtp: emailOtp,
            emailOtpExpires: OtpExpires,
            password: hashedPassword,
            ...(mobileNumber && { mobileNumberOtp: mobileOtp, mobileNumberOtpExpires: mobileOtpExpiry }),
            ...(profilePic && { profilePic: profilePic })
        });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            message: 'User registered successfully. Please verify your email.',
            user: user,
            auth: token
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.', result: error.message });
    }
}

exports.verifyEmailOtp = async (req, res) => {
    const { otp } = req.body;
    try {
        // const userObj = req.user
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
        }
        if (otp !== user.emailOtp || user.emailOtpExpires < Date.now()) {
            return res.status(400).json({ responseCode: 400, responseMessage: "Invalid OTP or OTP expired" });
        }
        user.emailOtp = null;
        user.emailOtpExpires = null;
        user.isVerified = true;
        await user.save();
        return res.status(200).json({ responseMessage: 'OTP verified successfully' });
    } catch (error) {
        return res.status(500).json({ responseMessage: "Error during OTP verification", responseResult: error.message });
    }
}

exports.verifyMobileOtp = async (req, res) => {
    const { otp } = req.body;
    try {
        // const userObj = req.user
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
        }
        if (otp !== user.mobileNumberOtp || user.mobileNumberOtpExpires < Date.now()) {
            return res.status(400).json({ responseCode: 400, responseMessage: "Invalid OTP or OTP expired" });
        }
        user.mobileNumberOtp = null;
        user.mobileNumberOtpExpires = null;
        await user.save();
        return res.status(200).json({ responseMessage: 'OTP verified successfully. Signup completed' });
    } catch (error) {
        return res.status(500).json({ responseMessage: "Error during OTP verification", responseResult: error.message });
    }
}

exports.logIn = async (req, res) => {
    try {
        if (req.body.password && req.body.email) {
            const result = await userModel.findOne({ email: req.body.email });
            if (!result) {
                return res.status(401).json({ message: 'User not found' });
            }

            if (!result.isVerified) {
                return res.status(401).json({ message: 'Please verify your OTP first' });
            }

            const passCheck = await bcrypt.compare(req.body.password, result.password);
            if (!passCheck) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            jwt.sign({ result }, process.env.JWT_SECRET_KEY, (err, token) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal server error' });
                } else {
                    return res.status(200).json({
                        message: "Login successful",
                        user: result,
                        auth: token
                    });
                }
            });
        } else {
            return res.status(400).json({ message: "Email and password are required" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.editProfile = async (req, res) => {
    const updateField = req.body;
    try {
        const user = await userModel.findById(req.user._id)
        console.log(user);
        if (updateField.email) {
            // Generate OTP
            const emailOtp = generateOTPEmail()
            const OtpExpires = emailOtpExpiryTime()

            let subject = `Change email OTP`;
            let text = `Your OTP for Change email : ${emailOtp}`;

            await mailer.autoMail(updateField.email, subject, text);

            user.emailOtp = emailOtp
            user.emailOtpExpires = OtpExpires
            console.log(user.emailOtp); 1
            await user.save()
        }

        let updateUser = await userModel.findByIdAndUpdate(user, updateField, { new: true });

        if (updateUser) {
            return res.send({ responseMessage: "User updated successfully", responseResult: updateUser });
        } else {
            return res.send({ responseMessage: "User not updated" });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', responseResult: error.message });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        // const userObj = req.user
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
        } else {
            const emailOtp = generateOTPEmail()
            const email = user.email;

            if (!email) {
                return res.status(400).json({ responseCode: 400, responseMessage: "Email not found for the user" });
            }
            let subject = `Reset your Password`
            let text = `Your OTP for forgot password : ${emailOtp}`;

            let resetMail = await mailer.autoMail(to = email, subject, text)
            user.emailOtp = emailOtp
            await user.save()
            return res.send({ statusCode: 201, message: "Email Sent Successfully", Result: resetMail })
        }
    } catch (error) {
        return res.send({ statusCode: 500, message: 'Invalid Input' })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        // const userObj = req.user
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
        }

        if (!password || !confirmPassword) {
            return res.status(400).json({ error: "Both password and confirm password fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password and confirm password do not match" });
        }
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let update = await userModel.findByIdAndUpdate(user, { password: hashedPassword }, { new: true })

        res.status(200).json({ message: "Password reset successfully", result: update });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        // const userObj = req.user
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
        }
        const emailOtp = generateOTPEmail()
        const email = user.email;
        let subject = `verify your otp`
        let text = `Your OTP : ${emailOtp}`;

        let resetMail = await mailer.autoMail(to = email, subject, text)
        user.emailOtp = emailOtp
        await user.save()
        return res.send({ statusCode: 201, message: "otp Sent Successfully", Result: resetMail })
    } catch (error) {
        return res.send({ statusCode: 500, message: 'Invalid Input', result: error.message })
    }
}

exports.logOut = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        res.status(500).json({ message: "Something went Wrong",result: error.message })

    }
}
exports.termsAndConditon=async(req,res)=>{
    const termsAndConditionsContent = `
Welcome to our platform! By accessing or using our services, you agree to comply with and be bound by the following terms and conditions... (your terms and conditions content goes here)
`;
res.send(termsAndConditionsContent);

}