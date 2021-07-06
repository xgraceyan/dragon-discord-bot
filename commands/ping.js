const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Pong!",
  execute(message, args, prefix) {
    message.channel.send(
      new MessageEmbed().setDescription(
        `:ping_pong: Pong! **${Date.now() - message.createdTimestamp} ms**`
      )
    );
  },
};
