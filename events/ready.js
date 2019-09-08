const rediss = require("redis");
const { redis } = require("../config");
const sub = rediss.createClient(redis);
const Discord = require("discord.js");

module.exports = (client) => {
    client.user.setActivity(`startup process, give me a moment plz ,_,`, { type: 'PLAYING' });

    let usercount = 0;

    for (i = 0; i < client.guilds.size; i++) {
        usercount += client.guilds.array()[i].memberCount;
    }

    console.log(`Logged in as ${client.user.tag} and looking at ${usercount} users(${client.guilds.size} guilds).`);
    client.user.setActivity(`${usercount} users`, { type: 'WATCHING' });

    console.log("====================");

    let guild;
    let channel;

    sub.subscribe("addedGuild");

    sub.on("addedGuild", (channel, message) => {
        guild = client.guilds.get("470582456828035073");
        channel = guild.channels.get("618398163837124609");
        let { name, owner } = message;
        embed = new Discord.RichEmbed()
            .setColor(0x2FF37A)
            .setTitle(`New guild has added me`)
            .setDescription(`${name} can now use commands I serve!`)
            .addField(`Thanks ${owner.displayName} for adding me!`);

        channel.send(embed);
    });

    sub.subscribe("leftGuild");

    sub.on("leftGuild", (channel, message) => {
        guild = client.guilds.get("470582456828035073");
        channel = guild.channels.get("618398163837124609");
        let { name, owner } = message;
        embed = new Discord.RichEmbed()
            .setColor(0x2FF37A)
            .setTitle(`Guild kicked me :(`)
            .setDescription(`${name} is not needing me anymore...`)
            .addField(`I don't love you ${owner.displayName}`);

        channel.send(embed);
    });
};
