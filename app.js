// const cron = require('node-cron');
const { bot } = require('./config-telegram.bot.js');
const jwt = require('jsonwebtoken');
const { accessBot } = require('./config-shitcoinhq-access.bot.js');
const config = require("./config.js")
console.log('Starting Insomnia Bot...');

// Our modules
const { getAndPostCoins } = require('./coinsHandler.js');  // Import the getAndPostCoins function
const { walletCommandHandler, chonkyCommandHandler, trendyCommandHandler, coingeckoTrendingCommandHandler, callCommandHandler, marketSummaryCommandHandler } = require('./commandHandlers.js');
// const { checkMessageForKeywords } = require('./watchHandler.js');

// // Set up command handlers
chonkyCommandHandler(bot);
trendyCommandHandler(bot);
coingeckoTrendingCommandHandler(bot);
callCommandHandler(bot);
walletCommandHandler(bot);
marketSummaryCommandHandler(bot);
// watchForCommandHandler(bot);
// clearWatchCommandHandler(bot);


// Scheduler function to run daily at 9 AM (UK is +1)
// cron.schedule('0 8 * * *', async () => {
//     try {
//         await getAndPostCoins(config.TELEGRAM_CHAT_ID, null, 'marketSummary');
//         await getAndPostCoins(-1001803361016, null, 'marketSummary'); // -1001803361016 = Insomnia Beta Discussion Group (single)
//     } catch (err) {
//         console.error('Error while fetching and posting coins:', err);
//     }
// });


// Scheduler function to run daily at 5 PM
// cron.schedule('0 17 * * *', async () => {
//   try {
//     const chatId = -1001959212353; // Replace with the desired chat ID, -1001959212353 = SRF main, -1001810737004 = test
//     const marketCapMin = 300; // Replace with the desired market cap value

//     await getAndPostCoins(config.TELEGRAM_CHAT_ID, 'trending');
//   } catch (err) {
//     console.error('Error while fetching and posting coins:', err);
//   }
// });

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

// Define a route to handle incoming POST requests to /snoop
app.post('/app', (req, res) => {
    // Parse and log the incoming data payload
    console.log('Received data:');
    console.log(req.body);

    const textAfterSnoop = req.body.message.text.replace(/^\/app\s+/, '') ?? 'n/a';
    const chatId = req.body.message.chat.id ?? 'n/a';
    const userId = req.body.message.from.id;
    const username = req.body.message.from.username;
    console.log(`chat id: ${chatId}, userid: ${userId}, username: ${username}`);

    // Send login link to paid subscriber :)
    const token = jwt.sign({ username: req.body.message.from.username }, secretKey);
    const options = { disable_web_page_preview: true };
    accessBot.sendMessage(chatId, `Here's the login link you requested:\nhttps://www.insomniahq.xyz/autologin/?auth=${token}`, options)
        .catch(err => {
            console.error('Error sending message:', err);
        });

    // Respond with a 200 status code to acknowledge receipt of the payload
    res.sendStatus(200);
});

app.post('/verify', (req, res) => {

    console.log('Received a request to /verify');
    const token = req.body.token;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
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