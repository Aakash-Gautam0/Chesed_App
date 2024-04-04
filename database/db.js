const mongoose = require('mongoose');


exports.connection = async (dbName) => {
    try {
        mongoose.set("strictQuery", false)

        const connectionString=`mongodb+srv://aakash:gautam@cluster0.j8hlbne.mongodb.net/${dbName}`
        
        await mongoose.connect(connectionString);
        console.log('________________________________________\n<- ✅ Database Connection Established ->\n________________________________________\n');

        mongoose.set('debug', true);
    } catch (err) {
        console.log('_________________________________________\n<- ⚠️ Database Connection Unsuccessful  ->\n_________________________________________\n');
        throw err;
    }
}