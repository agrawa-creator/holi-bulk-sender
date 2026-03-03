const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

app.use(express.static('public'));

client.on('qr', (qr) => { io.emit('qr', qr); });
client.on('ready', async () => {
    io.emit('ready', 'Connected! Sending wishes...');
    const contacts = await client.getContacts();
    const msg = "होली के पावन अवसर पर आपको हार्दिक शुभकामनाएं! 🎨\n\nHappy Holi! 🎉\n- Sent via Chirag's Tool";
    contacts.forEach((c, i) => {
        if (c.isMyContact && !c.isGroup) {
            setTimeout(() => { client.sendMessage(c.id._serialized, msg); }, i * 15000);
        }
    });
});

client.initialize();
server.listen(process.env.PORT || 3000);
