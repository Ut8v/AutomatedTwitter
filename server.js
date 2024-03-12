const express = require ('express');
require('dotenv').config();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const collection = require('./mongodb')
const twitterClient = require('./twitter')
const path = require('path');

const app = express();



//function to generate a teaser.
async function generateTeaser() {
    try {
        let teaser;
        let isUnique = false;

        while (!isUnique) {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: process.env.CONTENT }],
                model: "gpt-3.5-turbo"
            });

            teaser = completion.choices[0].message.content;

            // Check if the teaser exists in the database
            const existingTeaser = await collection.findOne({ Teaser: teaser });

            if (!existingTeaser) {
                isUnique = true;
            }
        }

        // Save the unique teaser to the database
        await collection.create({ Teaser: teaser });

        return teaser;
        
    } catch (error) {
        console.error('Error generating joke:', error);
    }
}

const tweet = async () => {
    try {
        let response = await generateTeaser();
        console.log(response);
        await twitterClient.v2.tweet(response);
    } catch (e) {
        console.log(e)
    }
    }

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,'mainpage.html'));
})

app.get('/tweet', (req, res)=>{
        tweet();
        res.send("Success");
})

app.listen(3000,()=>{
    console.log("server is running")
})

