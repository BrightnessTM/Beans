const { Bean } = require("../../utils/schemas");
module.exports = {
	controls: {
		name: "addbean",
		permission: 1,
		usage: "addbean",
		description: "Creates a new bean",
		enabled: true,
		permissions: ["VIEW_CHANNEL", "SEND_MESSAGES"]
	},
	do: async (message, client, args) => {
		if (args.length < 4) return message.channel.send("You must specify an emoji, bean name, embed color, image* and message. (The image is optional, just use a double space if you would like to ignore it)");
		let emoji = args[0];
		let name = args[1].toLowerCase();
		let color = args[2].toLowerCase();
		let image = args[3].toLowerCase();
		let msg = args.splice(4).join(" ");
		if (!name || !msg || !emoji) return message.channel.send("You omitted a required argument!");
		await new Bean({
			name,
			color,
			image,
			message: msg,
			emoji
		}).save();
		return message.channel.send("New bean created!");
	}
};

