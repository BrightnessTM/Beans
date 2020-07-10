const { release } = require("../config.json");
const chalk = require("chalk");

module.exports = async (Discord, client) => {
	const team = await client.fetchTeam()
		.catch(() => console.log(chalk`{red [{bold ERROR}] Error fetching team members.}`));

	for (const admin of team) {
		client.admins.add(admin.id);
		console.log(chalk`{blue [{bold INFO}] Found {bold ${admin.tag}}}`);
	}

	console.log(chalk`{green [{bold INFO}] Logged in as {bold ${client.user.tag}}! (Release: {bold ${release}}}`);

	client.user.setActivity(`with beans! • @${client.user.username} help`, { type: "PLAYING" });
};
