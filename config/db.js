const mongoose = require('mongoose');

const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://cami:cami@cluster0.qigiu.mongodb.net/project_mgnt_db?retryWrites=true&w=majority');
    console.log(`MongoDB Connected: ${conn.connection.host}`.blue.underline.bold);
};

module.exports = connectDb;