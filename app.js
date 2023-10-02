// const cron = require('node-cron');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { accessBot } = require('./config-shitcoinhq-access.bot.js');
const config = require("./config.js")
console.log('Starting Insomnia Bot...');

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// Create an HTTP server using Express
// https://docs.tgmembership.com/tgmembership/advanced/custom-commands

const express = require('express');
const app = express();
const port = 3000; // Replace with desired port number

const secretKey = process.env.JWT_SECRET_KEY;

// Remember to add this block to the server's NGINX config so it can listen at this port:
// location /snoop {
//   proxy_pass http://localhost:3000;
//   proxy_http_version 1.1;
//   proxy_set_header Upgrade $http_upgrade;
//   proxy_set_header Connection 'upgrade';
//   proxy_set_header Host $host;
//   proxy_cache_bypass $http_upgrade;
// }

// Use express.json() middleware for JSON parsing
app.use(express.json());

// Define a route to handle incoming POST requests to /login
app.post('/login', async (req, res) => {
    // Parse and log the incoming data payload
    console.log('Received data:');
    console.log(req.body);

    const chatId = req.body.message.chat.id ?? 'n/a';
    const userId = req.body.message.from.id;
    const username = req.body.message.from.username;
    console.log(`Insomnia Live login request received\nchat id: ${chatId}, userid: ${userId}, username: ${username}`);

    const apiKey = process.env.TGMEMBERSHIP_API_KEY;
    const apiUrl = `https://api.tgmembership.com/bot6448465749/${apiKey}/getSubscribers?user_id=${userId}`;

    try {
        const response = await axios.get(apiUrl);
        const { plan_id } = response.data.result;

        if (plan_id === 2 || plan_id === 3) {
            // Send login link to paid subscriber :)
            const token = jwt.sign({ username }, secretKey);
            const options = { disable_web_page_preview: true };
            accessBot.sendMessage(chatId, `Here's the login link you requested:\nhttps://www.insomniahq.xyz/login/?auth=${token}`, options);
        } else {
            accessBot.sendMessage(chatId, "Sorry, it looks like you're not a paid subscriber to Insomnia Live.");
        }

    } catch (err) {
        console.error('API call or something else went wrong:', err);
        accessBot.sendMessage(chatId, "Sorry, an error occurred while checking your subscription. Please wait a minute and try again.");
    }

    res.sendStatus(200);
});

app.post('/verify', (req, res) => {

    console.log('Received a request to /verify');
    const token = req.body.token;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired' });
            }
            return res.status(401).json({ message: 'Token verification failed' });
        }
        // Send back the decoded information
        res.json(decoded);
        // Log 
        console.log('Sucessfully decoded token');
        // Tell the user they have logged in, lolz
        // const options = { disable_web_page_preview: true };
        // accessBot.sendMessage(chatId, `👋 Login to your Shitcoin HQ account detected. Hopefully this was you - if not, nae luck pal! 💩`, options)
        //     .catch(err => {
        //         console.error('Error sending message:', err);
        //     });
    });
});

// Start the HTTP server and listen on the specified port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// {
//   "update_id": 934743212,
//   "message": {
//    "message_id": 2741,
//    "from": {
//     "id": 1515817509,
//     "is_bot": false,
//     "first_name": "cr_zilla (◕‿◕)",
//     "username": "cr_zilla"
//    },
//    "chat": {
//     "id": -1001959212353,
//     "title": "not a moron",
//     "is_forum": true,
//     "type": "supergroup"
//    },
//    "date": 1690906707,
//    "left_chat_participant": {
//     "id": 6119345747,
//     "is_bot": true,
//     "first_name": "WDBetaBot",
//     "username": "WDBetaBot"
//    },
//    "left_chat_member": {
//     "id": 6119345747,
//     "is_bot": true,
//     "first_name": "WDBetaBot",
//     "username": "WDBetaBot"
//    }
//   }
//  }