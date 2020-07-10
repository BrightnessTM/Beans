const { colors, main_guild, super_role } = require("../../config.json");
const { fetchUser } = require("../../utils/misc");
const { dbQuery, dbQueryNoNew } = require("../../utils/db");
module.exports = {
	controls: {
		name: "stats",
		permission: 10,
		usage: "stats (user)",
		aliases: ["beans", "verify"],
		description: "Shows bean stats",
		enabled: true,
		permissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"]
	},
	do: async (message, client, args, Discord) => {
		let user = await fetchUser(args[0] ? args[0] : message.author.id, client);
		if (!user || user.id === "0") user = message.author;

		let qUserDB = await dbQuery("User", { id: user.id });

		let posArr = [];
		if (client.admins.has(user.id)) posArr.push(":tools: Developer");
		if (client.guilds.cache.get(main_guild).members.cache.get(user.id) && client.guilds.cache.get(main_guild).members.cache.get(user.id).roles.cache.has(super_role)) posArr.push(":sunglasses: The Power of BEAN");

		let embed = new Discord.MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL({format: "png", dynamic: true}))
			.setColor(colors.default);
		if (posArr.length > 0) embed.addField("Special Acknowledgements", `${posArr.join("\n")}`);

		if (qUserDB.beans.received.length > 0) {
			let beanArr = [];
			for (const b of qUserDB.beans.received) {
				beanArr.push(`${(await dbQueryNoNew("Bean", {name: b.beantype})).emoji} ${b.beantype}: ${b.count}`);
			}
			embed.addField("Received Beans", beanArr);
		}
		if (qUserDB.beans.sent.length > 0) {
			let beanArr = [];
			for (const b of qUserDB.beans.sent) {
				beanArr.push(`${(await dbQueryNoNew("Bean", {name: b.beantype})).emoji} ${b.beantype}: ${b.count}`);
			}
			embed.addField("Sent Beans", beanArr);
		}

		return message.channel.send(embed);
	}
};
