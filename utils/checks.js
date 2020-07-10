module.exports = {
	/**
	 * Returns permission level of inputted ID
	 *
	 * 11 - Blocked
	 * 10 - Everyone
	 * 3 - Server Staff
	 * 2 - Server Admin
	 * 1 - Global Staff Flag
	 * 0 - Developer/Global Admin
	 *
	 * @param member - Member object fetched from a server
	 * @param client - The Discord client
	 * @returns {Promise<number>}
	 */
	checkPermissions: async (member, client) => {
		const { main_guild, super_role } = require("../config.json");
		if (!member || !member.id || !client) return 10;
		if (client.admins.has(member.id)) return 0;
		if (client.guilds.cache.get(main_guild).members.cache.get(member.id) && client.guilds.cache.get(main_guild).members.cache.get(member.id).roles.cache.has(super_role)) return 1;
		return 10;
	},
	channelPermissions: (permissionCheckFor, channel, client) => {
		let channelPermissions = channel.permissionsFor(client.user.id);
		const perms = require("./permissions");
		let missing = permissionCheckFor.filter(p => !channelPermissions.has(p)).map(p => perms[p]);
		return missing.length < 1 ? null : `This command cannot be run because ${client.user.username} is missing some required permissions in this channel:\n- ${missing.join("\n- ")}\n\nYou can fix this by giving ${client.user.username} these permission(s) in channel or server settings.`;
	},
	/**
	 * Check a URL to see if it makes a valid attachment
	 * @param {string} url - The string to be checked
	 * @returns {boolean}
	 */
	checkURL: function (url) {
		const validUrl = require("valid-url");
		if (validUrl.isUri(url)){
			let noparams = url.split("?")[0];
			return (noparams.match(/\.(jpeg|jpg|gif|png)$/) != null);
		} else return false;
	}
};
