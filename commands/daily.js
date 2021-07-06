module.exports = {
  name: "daily",
  description: "Receive your daily reward.",
  execute(message, args, embedTemplate, dailyCooldown, con, coins) {
    if (dailyCooldown.has(message.author.id)) {
      message.channel.send(
        embedTemplate.setDescription(
          `${message.author.toString()}, You can only claim your daily reward every 24 hours!`
        )
      );
    } else {
      con.query(
        `UPDATE economy SET coins = ${coins + 100} WHERE id = ${
          message.author.id
        }`
      );
      message.channel.send(
        embedTemplate.setDescription(
          `Here is your daily reward of :coin: **100**, ${message.author.toString()}!`
        )
      );
      dailyCooldown.add(message.author.id);
      setTimeout(() => {
        dailyCooldown.delete(message.author.id);
      }, 86400000);
    }
  },
};
