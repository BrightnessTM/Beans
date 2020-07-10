const { checkPermissions, channelPermissions } = require("../utils/checks");
const { dbQuery, dbQueryNoNew, dbModify } = require("../utils/db");
const { findUserAndMember } = require("../utils/misc");

module.exports = async (Discord, client, message) => {
	if (!["text", "news"].includes(message.channel.type) || message.author.bot) return;

	let permission = await checkPermissions(message.member, client);

	const match = message.content.match(new RegExp(`^(<@!?${client.user.id}> ?)([\\S]+)`));
	if (!match) return;
	let args = message.content.split(" ").splice(match[1].endsWith(" ") ? 2 : 1);
	let command = client.commands.find((c) => c.controls.name.toLowerCase() === match[2].toLowerCase() || c.controls.aliases && c.controls.aliases.includes(match[2].toLowerCase()));
	let bean = await dbQueryNoNew("Bean", { name: match[2].toLowerCase() });
	if (command) {
		if (!command.controls.enabled) return message.channel.send("This command has been disabled globally.");
		if (permission > command.controls.permission) return;

		if (command.controls.permissions && message.channel.type !== "dm") {
			let checkPerms = channelPermissions(command.controls.permissions, message.channel, client);
			if (checkPerms) return message.channel.send(checkPerms).catch(() => {});
		}

		try {
			command.do(message, client, args, Discord)
				.catch((err) => {
					console.log(err);
				});
		} catch (err) {
			console.log(err);
		}
	} else if (bean) {
		let checkPerms = channelPermissions(["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"], message.channel, client);
		if (checkPerms) return message.channel.send(checkPerms).catch(() => {});

		let [err, user] = await findUserAndMember(args[0], message.guild);
		if (err) return message.channel.send(err);

		let embed = new Discord.MessageEmbed();
		if (client.admins.has(user.id) && !client.admins.has(message.author.id)) {
			user = message.author;
			embed.addField(":shield: Bean Reflection", "This user has bean reflection enabled... NO U!");
		}


		let qUserDB = await dbQuery("User", { id: message.author.id });
		let qReceiveDB = await dbQuery("User", { id: user.id });
		if (message.author.id === user.id) {
			if (qUserDB.beans.sent.find(b => b.beantype === bean.name)) qUserDB.beans.sent.find(b => b.beantype === bean.name).count++;
			else qUserDB.beans.sent.push({
				beantype: bean.name,
				count: 1
			});
			if (qUserDB.beans.received.find(b => b.beantype === bean.name)) qUserDB.beans.received.find(b => b.beantype === bean.name).count++;
			else qUserDB.beans.received.push({
				beantype: bean.name,
				count: 1
			});
		} else {
			if (qUserDB.beans.sent.find(b => b.beantype === bean.name)) qUserDB.beans.sent.find(b => b.beantype === bean.name).count++;
			else qUserDB.beans.sent.push({
				beantype: bean.name,
				count: 1
			});
			if (qReceiveDB.beans.received.find(b => b.beantype === bean.name)) qReceiveDB.beans.received.find(b => b.beantype === bean.name).count++;
			else qReceiveDB.beans.received.push({
				beantype: bean.name,
				count: 1
			});
		}

		await dbModify("User", { id: message.author.id }, qUserDB);
		if (message.author.id !== user.id) await dbModify("User", { id: user.id }, qReceiveDB);

		let msg = bean.message;
		let reason = args.splice(1).join(" ");
		if (msg.includes("{{user}}")) msg = msg.replace(new RegExp("{{user}}", "g"), user.username);
		if (msg.includes("{{sender}}")) msg = msg.replace(new RegExp("{{sender}}", "g"), message.author.username);
		if (msg.includes("{{reason}}")) msg = msg.replace(new RegExp("{{reason}}", "g"), reason || "no reason");

		message.channel.send(
			embed.setColor(bean.color)
				.setImage(bean.image || "")
				.setDescription(`${bean.emoji} ${msg}`));
	}
};
