const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "balance",
  description: "Get a user's balance.",
  execute(message, args, con, coins, slots) {
    if (!args.length) {
      message.channel.send(
        new MessageEmbed()
          .setDescription(
            `:coin: **${coins}** coins \n:package: **${slots}** dragon slots`
          )
          .setTitle(`${message.author.username}'s Balance`)
      );
    } else {
      const taggedUser = message.mentions.users.first();
      if (taggedUser != null) {
        con.query(
          `SELECT * FROM economy WHERE id = ${taggedUser.id}`,
          (err, results) => {
            if (results.length >= 1) {
              message.channel.send(
                new MessageEmbed()
                  .setDescription(
                    `:coin: **${coins}** coins \n:package: **${slots}** dragon slots`
                  )
                  .setTitle(`${taggedUser.username}'s Balance`)
              );
            } else {
              message.channel.send(
                new MessageEmbed().setDescription(
                  `${message.author.toString()}, The user you mentioned has not interacted with Dragon yet!`
                )
              );
            }
          }
        );
      } else {
        message.channel.send(
          new MessageEmbed().setDescription(
            `${message.author.toString()}, Please specify a user!`
          )
        );
      }
    }
  },
};
