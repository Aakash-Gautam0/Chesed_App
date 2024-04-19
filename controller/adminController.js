const adminModel = require("../model/adminModel")



exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const newAdmin = new adminModel({ email, password });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.logIn = async (req, res) => {
    try {
        if (req.body.password && req.body.email) {
            const result = await adminModel.findOne({ email: req.body.email });
            if (!result) {
                return res.status(401).json({ message: 'admin not found' });
            }
            // const passCheck = await bcrypt.compare(req.body.password, result.password);
            // if (!passCheck) {
            //     return res.status(401).json({ message: 'Invalid password' });
            // }
            else {
                return res.status(401).json({ message: 'Login successfully', result: result});
            }


        } else {
            return res.status(400).json({ message: "Email and password are required" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}