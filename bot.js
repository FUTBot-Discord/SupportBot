const Discord = require('discord.js');
const fs = require("fs");

const client = new Discord.Client();
const { token } = require('./config.js');

client.config = general;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.login(token);