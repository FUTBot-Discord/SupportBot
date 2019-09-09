const Discord = require("discord.js");
const rediss = require("redis");
const { redis } = require("../config");
const pub = rediss.createClient(redis);

pub.on("error", (err) => {
    console.log(`Error ${err}`);
});

module.exports = (client, member) => {
    pub.publish("updateStatus");

    const channel = member.guild.channels.get("534766452138311690");

    const embed = new Discord.RichEmbed()
        .setColor(0x2FF37A)
        .setTitle(`New user joined the guild`)
        .setDescription(`${member.user.tag} has joined the guild!`)

    channel.send(embed)
        .catch(e => {
            console.log(e)
        })
}