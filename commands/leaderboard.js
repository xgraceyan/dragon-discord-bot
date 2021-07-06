const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "leaderboard",
  description: "Coin leaderboard for current server.",
  execute(message, args, con, bot) {
    con.query("SELECT * FROM economy ORDER BY coins DESC", (err, results) => {
      if (results.length > 1) {
        var cashtop = new MessageEmbed().setTitle(
          `Wealth Leaderboard for ${message.guild}`
        );
        let r = 0;
        let guild = bot.guilds.cache.get(`${message.guild}`);
        for (i = 0; i <= results.length - 1; i++) {
          if (i > 5) break;
          if (message.guild.member(`${results[`${i}`].id}`)) {
            r++;
            cashtop.addField(
              `**${r}.** ${
                message.guild.members.cache.get(`${results[`${i}`].id}`).user
                  .tag
              }`,
              `**:coin: ${results[`${i}`].coins}** coins`
            );
          } else {
            continue;
          }
        }
        message.channel.send(cashtop);

        if (err) throw err;
      } else {
        message.channel.send(
          new MessageEmbed()
            .setTitle("No leaderboard")
            .setDescription("Less than 1 user has interacted with Dragon.")
        );
      }
    });
  },
};
