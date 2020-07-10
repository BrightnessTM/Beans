const { dbQueryAll } = require("../../utils/db");
const { colors } = require("../../config.json");

module.exports = {
	controls: {
		name: "help",
		permission: 10,
		aliases: ["command", "howto", "prefix"],
		usage: "help (command name)",
		description: "Shows command information",
		enabled: true,
		docs: "all/help",
		permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"]
	},
	do: async (message, client, args, Discord) => {
		let beans = await dbQueryAll("Bean", {});
		let embed = new Discord.MessageEmbed()
			.setDescription(`The bot's prefix is its mention (<@${client.user.id}>)\n\n\`help\` - Shows this page\n\`invite\` - Shows the link to invite the bot\n\`support\` - Shows the link to the support server\n\`ping\` - Checks bot latency and shows statistics\n\`stats\` - Shows bean statistics\n\n**How to Bean**\nReplace <bean type> with one of the bean names below, and <user> with the user you want to bean!\n\`@${client.user.username} <bean type> <user> (reason)\``)
			.addField("Types of Bean",
				beans.map(b => b.name).join(", "))
			.setColor(colors.default);

		return message.channel.send(embed);
	}
};
