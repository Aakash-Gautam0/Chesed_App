const categoriesModel = require("../model/categoriesModel")
const userModel = require("../model/userModel")
const authenticateToken = require('../middlewares/userAuth');


exports.createRideShareRqst = async (req, res) => {

  try {
    const { title, description, pickupLocation, whereTo, noOfMales, noOfFemale } = req.body;
    // const userObj = req.user;
    const user = await userModel.findById( req.user._id);

    if (!user) {
      return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
    }

    const userName = user.name;

    let category = await categoriesModel.findOne();

    if (!category) {
      category = new categoriesModel();
    }

    const newRideShare = {
      title,
      description,
      pickupLocation,
      whereTo,
      noOfMales,
      noOfFemale,
      userName // Include userName in the newRideShare object
    };

    category.rideShare.push(newRideShare);

    await category.save();

    res.status(201).json({ message: 'Ride share data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createPackageTransport = async (req, res) => {

  try {
    const { title, description, pickupLocation, transportTo, noOfItems, totalWeight } = req.body;
    // const userObj = req.user
    const user = await userModel.findById( req.user._id);
    if (!user) {
      return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
    }
    const userName = user.name;
    let category = await categoriesModel.findOne();
    if (!category) {
      category = new categoriesModel();
    }
    const newPackageTransport = {
      title,
      description,
      pickupLocation,
      transportTo,
      noOfItems,
      totalWeight,
      userName
    };

    category.packageTransport.push(newPackageTransport);

    await category.save();

    res.status(201).json({ message: 'Package Transport data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
exports.createGemochFinder = async (req, res) => {

  try {
    const { title, description, location } = req.body;
    // const userObj = req.user
    const user = await userModel.findById( req.user._id);
    if (!user) {
      return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
    }
    const userName = user.name;
    let category = await categoriesModel.findOne();
    if (!category) {
      category = new categoriesModel();
    }
    const newGemochFinder = {
      title,
      description,
      location,
      userName
    };

    category.gemochFinder.push(newGemochFinder);

    await category.save();

    res.status(201).json({ message: 'Gemoch Finder data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
exports.createAdvice = async (req, res) => {

  try {
    const { title, description } = req.body;
    const userObj = req.user
    const user = await userModel.findOne({ _id: userObj.userId });
    if (!user) {
      return res.status(400).json({ responseCode: 400, responseMessage: "User not found" });
    }
    const userName = user.name;
    let category = await categoriesModel.findOne();
    if (!category) {
      category = new categoriesModel();
    }
    const newAdvice = {
      title,
      description,
      userName
    };

    category.advice.push(newAdvice);

    await category.save();

    res.status(201).json({ message: 'Advice/Information data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.getAllDetails = async (req, res) => {
  try {
    const categories = await categoriesModel.findOne();
    if (!categories) {
      return res.status(404).json({ message: 'No details found' });
    }
    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getDetailsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    let result;

    switch (category) {
      case 'rideShare':
        result = await categoriesModel.findOne({}, 'rideShare');
        break;
      case 'packageTransport':
        result = await categoriesModel.findOne({}, 'packageTransport');
        break;
      case 'gemochFinder':
        result = await categoriesModel.findOne({}, 'gemochFinder');
        break;
      case 'advice':
        result = await categoriesModel.findOne({}, 'advice');
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    if (!result) {
      return res.status(404).json({ message: 'No details found for this category' });
    }

    res.status(200).json({ [category]: result[category] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
