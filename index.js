const express = require('express');
var cors = require('cors');

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

// app.use(cors());
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(express.urlencoded());

app.get('/cors', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://campusbook-ict4d.vercel.app');
    res.send({ "msg": "This has CORS enabled 🎈" })
    })


app.get('/', (req, res) => {
    res.send('Execution of server termine with successful !!! You can visit apk at https://campusbook-ict4d.vercel.app ');
});

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if(type === 'message.new') {
        members
            .filter((member) => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if(!user.online) {
                    twilioClient.messages.create({
                        body: `Vous avez un nouveau message de ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                        .then(() => console.log('Message envoyer !'))
                        .catch((err) => console.log(err));
                }
            })

            return res.status(200).send('Message envoyer !');
    }

    return res.status(200).send('Pas des messages des nouvelles requetes');
});

app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Execution Serveur reussi au port ${PORT}`));




