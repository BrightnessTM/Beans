const { support_invite } = require("../../config.json");
module.exports = {
	controls: {
		name: "support",
		permission: 10,
		usage: "support",
		description: "Shows the link to the support server",
		enabled: true,
		permissions: ["VIEW_CHANNEL", "SEND_MESSAGES"]
	},
	do: (message) => {
		return message.channel.send(`Need help?\nWant to suggest new types of beans?\n\nJoin the support server! https://discord.gg/${support_invite}`);
	}
};
