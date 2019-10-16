const rediss = require("redis");
const { redis } = require("../config");
const sub = rediss.createClient(redis);
const Discord = require("discord.js");
const express = require('express');
const bodyParser = require('body-parser');

sub.on("error", (err) => {
    console.log(`Error ${err}`);
});

module.exports = (client) => {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });

    app.post('/votes', (req, res) => {
        console.log(req)
    });

    app.use((req, res) => {
        res.status(404).send({ url: req.originalUrl + ' not found' });
    });

    client.user.setActivity(`startup process, give me a moment plz ,_,`, { type: 'PLAYING' });

    let usercount = 0;

    for (i = 0; i < client.guilds.size; i++) {
        usercount += client.guilds.array()[i].memberCount;
    }

    console.log(`Logged in as ${client.user.tag} and looking at ${usercount} users(${client.guilds.size} guilds).`);
    client.user.setActivity(`${usercount} users`, { type: 'WATCHING' });

    console.log("====================");

    sub.on("message", (channel, message) => {
        let guild = client.guilds.get("470582456828035073");
        let notifyChannel = guild.channels.get("618398163837124609");
        let { guildName, guildOwner } = JSON.parse(message);

        if (channel == 'addedGuild') {
            embed = new Discord.RichEmbed()
                .setColor(0x2FF37A)
                .setTitle(`New guild has added me`)
                .setDescription(`${guildName} can now use commands I serve!`)
                .setFooter(`Thanks ${guildOwner} for adding me!`);
        } else if (channel == 'leftGuild') {
            embed = new Discord.RichEmbed()
                .setColor(0x2FF37A)
                .setTitle(`Guild kicked me :(`)
                .setDescription(`${guildName} is not needing me anymore...`)
                .setFooter(`I don't love you ${guildOwner}`);
        }

        notifyChannel.send(embed);
    });

    sub.subscribe("addedGuild");
    sub.subscribe("leftGuild");

};
