const mongoose = require("mongoose");
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
           
        });
        console.log(`database coonnected: ${conn.connection.host}`);        
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit()
    }
}
module.exports = connectDb;