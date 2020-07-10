const { confirmation } = require("../../utils/actions");
module.exports = {
	controls: {
		name: "reboot",
		permission: 0,
		aliases: ["refresh", "shutdown", "restart"],
		usage: "reboot (shard id)",
		description: "Reboots the bot by exiting the process",
		enabled: true,
		permissions: ["VIEW_CHANNEL", "SEND_MESSAGES"]
	},
	do: async (message, client) => {
		if ((
			await confirmation(
				message,
				`:warning: Are you sure you would like to reboot **${client.user.username}**?`,
				{
					deleteAfterReaction: true
				}
			)
		)) {
			await message.channel.send("Rebooting...");
			process.exit();
		}
	}
};
