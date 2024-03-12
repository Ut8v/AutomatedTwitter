const { TwitterApi } = require("twitter-api-v2");

// Twitter API keys
const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
    bearer: process.env.BEARER_TOKEN
});

const bearer = new TwitterApi(process.env.BEARER_TOKEN);
  //to create tweet
const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;

module.exports = twitterClient;