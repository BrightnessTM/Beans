const { colors } = require("../../config.json");
const { fetchUser } = require("../../utils/misc.js");
const humanizeDuration = require("humanize-duration");
const ms = require("ms");
module.exports = {
	controls: {
		name: "ping",
		permission: 10,
		aliases: ["hi", "about", "bot"],
		usage: "ping",
		description: "Checks bot response time and shows information",
		enabled: true,
		permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"]
	},
	do: async (message, client, args, Discord) => {
		let developerArray = [];
		for (let developerId of client.admins) {
			let user = await fetchUser(developerId, client);
			user ? developerArray.push(`${Discord.Util.escapeMarkdown(user.tag)} (${user.id})`) : developerArray.push(`${developerId}`);
		}

		let embed = new Discord.MessageEmbed()
			.addField("Developers", developerArray.join("\n"))
			.addField("Guild Count", client.guilds.cache.size)
			.addField("Uptime", humanizeDuration(client.uptime))
			.addField("Client Ping", `${Math.round(client.ws.ping)} ms`)
			.setFooter(`${client.user.tag} v1`, client.user.displayAvatarURL({format: "png"}))
			.setThumbnail(client.user.displayAvatarURL({format: "png"}))
			.setColor(colors.default);

		const before = Date.now();
		message.channel.send(embed).then((sent) => {
			embed.addField("Bot Latency", ms(Date.now() - before));
			sent.edit(embed);
		});
	}
};

