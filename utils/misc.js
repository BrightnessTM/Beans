const { promises } = require("fs");
const { resolve } = require("path");

module.exports = {
	findUserAndMember: async function (input, guild) {
		let user = await module.exports.fetchUser(input, guild.client);
		if (!user) return ["You must specify a valid user!"];
		if (guild.members.cache.get(user.id)) return [null, user, guild.members.cache.get(user.id)];
		return guild.members.fetch(user.id).then(() => {
			if (!guild.members.cache.get(user.id)) return ["This user is not a server member!", user];
			return [null, user, guild.members.cache.get(user.id)];
		}).catch(() => {
			return ["This user is not a server member!", user];
		});
	},
	permLevelToRole: (permLevel) => {
		switch (permLevel) {
		case -1:
			return "No Users";
		case 0:
			return "Bot Administrators";
		case 1:
			return "The Power of BEAN";
		case 10:
			return "All Users";
		default:
			return "???";
		}
	},
	/**
	 * Fetch a user
	 * @param {string} id - The Discord ID of the user
	 * @param {module:"discord.js".Client} client - The bot client
	 * @returns {Collection}
	 */
	fetchUser: async function (id, client) {
		if (!id) return null;
		let matches = id.match(/^<@!?(\d+)>$/);
		let foundId = (matches ? matches[1] : null) || (client.users.cache.find(u => u.tag === id) ? client.users.cache.find(u => u.tag === id).id : null) || id;

		function fetchUnknownUser(uid) {
			return client.users.fetch(uid, true)
				.then(() => {
					return client.users.cache.get(uid);
				})
				.catch(() => {
					return null;
				});
		}

		return client.users.cache.get(foundId)
			|| fetchUnknownUser(foundId)
			|| null;
	},
	/**
	 * Like readdir but recursive 👀
	 * @param {string} dir
	 * @returns {Promise<string[]>} - Array of paths
	 */
	fileLoader: async function* (dir) {
		const { fileLoader } = require("./misc");
		const files = await promises.readdir(dir, { withFileTypes: true });
		for (let file of files) {
			const res = resolve(dir, file.name);
			if (file.isDirectory()) {
				yield* fileLoader(res);
			} else {
				yield res;
			}
		}
	}
};
