const Discord = require("discord.js");

module.exports = (client, member) => {
    const channel = member.guild.channels.get("534766452138311690");

    const embed = new Discord.RichEmbed()
        .setColor(0x2FF37A)
        .setTitle(`User left the guild :(`)
        .setDescription(`${member.user} you're not my favorite anymore...`)

    return channel.send(embed);
}