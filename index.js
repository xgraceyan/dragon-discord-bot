const Discord = require("discord.js");
const bot = new Discord.Client();
const { Client, MessageEmbed } = require("discord.js");
const fs = require("fs");
const mysql = require("mysql");

const prefix = "d!";

const embedTemplate = new MessageEmbed();

const dailyCooldown = new Set();

bot.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dudu0809",
  database: "dragons",
});

con.connect((err) => {
  console.log("Connected to db");
});

bot.on("ready", () => {
  console.log("Dragon is online");
});

bot.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == "ping") {
    bot.commands.get("ping").execute(message, args, prefix);
  } else if (command == "invite") {
    message.channel.send(
      new MessageEmbed()
        .setTitle(`Invite me to your server!`)
        .setURL(
          "https://discord.com/oauth2/authorize?client_id=861689499792703498&scope=bot&permissions=8"
        )
    );
  }

  con.query(
    `SELECT * FROM economy WHERE id = ${message.author.id}`,
    (err, results) => {
      if (results.length >= 1) {
        var coins = results[0].coins;
        var slots = results[0].slots;

        if (command == "daily") {
          bot.commands
            .get("daily")
            .execute(message, args, embedTemplate, dailyCooldown, con, coins);
        } else if (command == "bal" || command == "balance") {
          bot.commands.get("balance").execute(message, args, con, coins, slots);
        } else if (command == "leaderboard") {
          bot.commands.get("leaderboard").execute(message, args, con, bot);
        }
      } else {
        // New user
        con.query(
          `INSERT INTO economy (id, coins, slots) VALUE ('${
            message.author.id
          }', ${200}, ${5})`
        );
        message.channel.send(
          embedTemplate.setDescription(
            `Welcome to Dragon, ${message.author.toString()}! Here's a welcome gift of :coin: **200** and **5** dragon slots.`
          )
        );
      }
    }
  );
});

bot.login("ODYxNjg5NDk5NzkyNzAzNDk4.YONc4g.sjKw61za9HE0EPnppenHaKnGO1Q");
