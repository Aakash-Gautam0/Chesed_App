const feedbackModel = require("../model/feedbackModel")
const userModel = require("../model/userModel")

exports.create = async (req, res) => {
    try {
        const { title, description } = req.body
        const usertitle = await feedbackModel.findOne({ title: title })
        if (usertitle) {
            res.json("title already exist")
        }
        else {
            if (title && description) {
                const newFeedback = new feedbackModel(
                    {
                        userId: req.user._id,
                        title: title,
                        description: description,
                    }
                )
                await newFeedback.save()
                res.json("feedback submitted successfully")
            }

            else {
                res.json("Please Enter Both fields")
            }
        }
    } catch (error) {
        res.send({ message: "Invalid input", result: error.message })
    }
}
exports.read = async (req, res) => {
    try {
        const feedbacks = await feedbackModel.find();
        if (!feedbacks) {
            return res.status(404).json({ message: 'No details found' });
        }
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
exports.deleteFeedback = async (req, res) => {
    try {
        let id = req.user._id
        const deleteFeedback = await feedbackModel.findOneAndDelete({ userId: id })
        if (deleteFeedback) {
            res.json("Feedback Deleted Successfully")
        }
        else {
            res.json("feedback not found")
        }

    } catch (error) {
        res.json("Invalid input")

    }
}
exports.findOneFeedback = async (req, res) => {
    try {
        let id = req.user._id
        const getFeedback = await feedbackModel.find({ userId: id })
        if (getFeedback) {
            res.json(getFeedback)
        }
        else {
            res.json("feedback not found")
        }
    } catch (error) {
        res.json("Invalid Input")

    }
}

