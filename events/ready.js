const rediss = require("redis");
const {
    redis
} = require("../config");
const sub = rediss.createClient(redis);
const Discord = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");
const {
    GraphQLClient
} = require("graphql-request");
const graphql = new GraphQLClient(process.env.G_ENDPOINT, {
    headers: {}
});

async function getUserClubId(author_id) {
    let query = `{ getUserClubByAuthorId(author_id: "${author_id}") { id points coins creation_time } }`;
    let res = await graphql.request(query);

    return res.getUserClubByAuthorId;
}

async function createUserClub(author_id) {
    let query = `mutation { createUserClub(author_id: "${author_id}") { id } }`;

    try {
        await graphql.request(query);
    } catch (e) {
        console.log(e);
        return false;
    }

    return true;
}

async function addPointsToClub(club_id, points) {
    let query = `mutation { addPointsToClub(club_id: "${club_id}", points: "${points}") { id } }`;

    try {
        await graphql.request(query);
    } catch (e) {
        console.log(e);
        return false;
    }

    return true;
}

sub.on("error", err => {
    console.log(`Error ${err}`);
});

module.exports = client => {
    const app = express();
    const guild = client.guilds.get("470582456828035073");

    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    );
    app.use(bodyParser.json());
    app.listen(3000, () => {
        console.log("Votes can be send to port 3000");
    });

    app.post("/votes", async (req, res) => {
        const {
            bot,
            user
        } = req.body;
        let notifyChannel;

        if (!user || user == undefined) return;

        let iUser = await getUserClubId(user);

        if (iUser == null) {
            await createUserClub(user);
            iUser = await getUserClubId(user);
        }

        addPointsToClub(iUser.id, 75);

        if (bot === "520694612080328709") {
            notifyChannel = guild.channels.get("650800677215404083");
        } else {
            notifyChannel = guild.channels.get("650800555542708234");
        }

        const vUser = await client.fetchUser(user);
        const embed = new Discord.RichEmbed()
            .setColor(0x2ff37a)
            .setTitle(`New vote got recieved`)
            .setDescription(`${vUser.username} voted for me!`)
            .setFooter(`Thanks ${vUser.username} for the vote!`);

        notifyChannel.send(embed);
    });

    app.use((req, res) => {
        res.status(404).send({
            url: req.originalUrl + " not found"
        });
    });

    client.user.setActivity(`startup process, give me a moment plz ,_,`, {
        type: "PLAYING"
    });

    let usercount = 0;

    for (i = 0; i < client.guilds.size; i++) {
        usercount += client.guilds.array()[i].memberCount;
    }

    console.log(
        `Logged in as ${client.user.tag} and looking at ${usercount} users(${client.guilds.size} guilds).`
    );

    client.user.setActivity(`${usercount} users`, {
        type: "WATCHING"
    });

    console.log("====================");

    sub.on("message", (channel, message) => {
        const {
            guildName,
            guildOwner,
            botId
        } = JSON.parse(message);
        const embed = new Discord.RichEmbed();

        let notifyChannel;

        if (channel == "addedGuild") {
            embed
                .setColor(0x2ff37a)
                .setTitle(`New guild has added me`)
                .setDescription(`${guildName} can now use commands I serve!`)
                .setFooter(`Thanks ${guildOwner} for adding me!`);
        } else {
            embed
                .setColor(0xff0000)
                .setTitle(`Guild kicked me :(`)
                .setDescription(`${guildName} is not needing me anymore...`)
                .setFooter(`I don't love you ${guildOwner}`);
        }

        if (botId === "520694612080328709") {
            notifyChannel = guild.channels.get("618398163837124609");
        } else {
            notifyChannel = guild.channels.get("640560405101543424");
        }

        notifyChannel.send(embed);
    });

    sub.subscribe("addedGuild");
    sub.subscribe("leftGuild");
};