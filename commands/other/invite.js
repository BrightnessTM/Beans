module.exports = {
	controls: {
		name: "invite",
		permission: 10,
		usage: "invite",
		description: "Shows the link to invite the bot",
		enabled: true,
		permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
		cooldown: 5
	},
	do: async (message, client) => {
		return message.channel.send(`You can invite me using this link: ${module.exports.url.replace("[ID]", client.user.id)}`);
	},
	url: "<https://discordapp.com/oauth2/authorize?client_id=[ID]&scope=bot&permissions=314368>"
};
