const Discord = require("discord.js");
module.exports = {
	/**
	 * Ask for confirmation before proceeding
	 * @param {Message} message Discord.js message object
	 * @param {string} confirmationMessage Ask for confirmation
	 * @param {ConfirmationOptions} [options] Options
	 * @param {string} [options.confirmMessage] Edit the message upon confirmation
	 * @param {string | MessageEmbed} [options.denyMessage] Edit the message upon denial
	 * @param {number} options.time Timeout
	 * @param {boolean} [options.keepReactions] Keep reactions after reacting
	 * @param {boolean} [options.deleteAfterReaction] Delete the message after reaction (takes priority over all other messages)
	 * @example
	 * const confirmationMessage: string = "Are you sure you would like to stop the bot?"
	 * const options = {
	 *   confirmMessage: "Shutting down...",
	 *   denyMessage: "Shutdown cancelled."
	 * }
	 *
	 * const proceed = await confirmation(message, confirmationMessage, options)
	 *
	 * if (proceed) process.exit(0)
	 */
	confirmation: async function (message, confirmationMessage = {}, options = {}) {
		const yesReaction = "✔️";
		const noReaction = "✖️";

		const filter = ({ emoji: { name } }, { id }) => (name === yesReaction || name === noReaction) && id === message.author.id;

		const msg = await message.channel.send(confirmationMessage);

		await msg.react(yesReaction);
		await msg.react(noReaction);

		const e = (await msg.awaitReactions(filter, {max: 1, time: options && options.time || 300000})).first();

		if (options && options.deleteAfterReaction) msg.delete();
		else if (!options && options.keepReactions && message.channel.type !== "dm") msg.reactions.removeAll();

		if (e && e.emoji && e.emoji.name === yesReaction) {
			if (options && options.confirmMessage && !options.deleteAfterReaction) await msg.edit(options && options.confirmMessage instanceof Discord.MessageEmbed ? {
				embed: options && options.confirmMessage,
				content: null
			} : {embed: null, content: options && options.confirmMessage});
			return true;
		} else {
			if (options && options.denyMessage && !options.deleteAfterReaction) await msg.edit(options && options.denyMessage instanceof Discord.MessageEmbed ? {
				embed: options && options.denyMessage,
				content: null
			} : {embed: null, content: options && options.denyMessage});
			return false;
		}
	}
};
