const mongoose = require("mongoose");
//mongo db connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_DBCONNECTION}`).then(()=>{
console.log('Connected successfully');
});

const tweetSchema = new mongoose.Schema({
    Teaser :{
    type: String 
    }
})

const collection = new mongoose.model('Tweets', tweetSchema);

module.exports = collection;