require('dotenv').config();
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const collection = require('./mongodb')
const twitterClient = require('./twitter')

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

tweet();

