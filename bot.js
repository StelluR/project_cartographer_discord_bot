const config = require('./config.json');
const { XP, sendRankUpMessage } =  require('./xp.js');
const { tryToLogin } = require('./reconnect');
const { handlePresenceUpdate, removeStaleRoles } = require('./presenceUpdateHandler');
const { Client, EmbedBuilder, GatewayIntentBits, Partials } = require('discord.js');
const chalk = require('chalk');

const bot = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildPresences,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const xpFile = 'xpData.json';
const xpBot = new XP(xpFile);

bot.on('ready', () =>
{
	console.log(chalk.bgGreen(`Logged in as ${bot.user.tag}`));
	removeStaleRoles(bot);
	if(config.xp_functionality) {
		xpBot.ready();
	}
});

bot.on('disconnect', () =>
{
	console.error(chalk.red('Disconnected from Discord. Attempting to reconnect...'));
	tryToLogin(bot, config.discord_token);
});

bot.on('error', error => 
{
	console.error(chalk.red('An error occurred:', error));
	bot.destroy()
	tryToLogin(bot, config.discord_token);

});

bot.on('reconnecting', () =>
{
	console.log(chalk.yellow('Reconnecting to Discord...'));
});

// Feature : The bot gives members a role depending the game they are currently playing
bot.on('presenceUpdate', handlePresenceUpdate);

// Feature : The bot gives members a rank based on their messages
if(config.xp_functionality) {
	bot.on('messageCreate', message => {
		xpBot.updateXpData(message, bot.user.id , function(level){
			sendRankUpMessage(message, level);
		});
	});
}

tryToLogin(bot, config.discord_token);
