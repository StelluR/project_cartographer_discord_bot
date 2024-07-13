const PLAYING_HALO2_ROLE = 'Playing Halo 2';
const HALO2_ACTIVITY_NAME = 'Halo 2 Project Cartographer';
const chalk = require('chalk');

function getPlayingHalo2Role(roles, guildName)
{
    let roleId;
    roles.cache.filter(role => role.name === PLAYING_HALO2_ROLE).forEach(role => {
      roleId = role.id;
    });
    if (!roleId) {
      throw new Error(chalk.red(`Could not find role ${PLAYING_HALO2_ROLE} in ${chalk.cyan.bgBlack(guildName)}`));
    }
    return roleId;
}

function removeRole(guildMember, role, guildName)
{
    guildMember.roles.remove(role).then((guildMember) => {
        console.log(`Removed stale Halo 2 role for member ${chalk.bgBlueBright.bold(guildMember.user.username)} in ${chalk.cyan.bgBlack(guildName)}`);
    }).catch((error) => {
        console.log(`${chalk.red('Error')} caught trying to remove stale roles for user ${chalk.bgBlueBright.bold(guildMember.user.username)} in ${chalk.cyan.bgBlack(guildName)}, error=${error}`);
    });
}

function checkAndRemoveHalo2Role(guildMember, guildName)
{
    guildMember.roles.cache.filter(role => role.name === PLAYING_HALO2_ROLE)
        .forEach(role => {
        removeRole(guildMember, role, guildName);
        });
}

function removeStaleRoles(bot)
{
    bot.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
        members.forEach(member => {
            checkAndRemoveHalo2Role(member, guild.name);
        });
        }).catch(console.error);
    });
}

function handlePresenceUpdate(oldPresence, newPresence)
{
    const discordMember = newPresence.member;
    if (!discordMember) return;
    const guild = discordMember.guild;
    const activities = newPresence.activities;
    const displayName = discordMember.nickname || discordMember.user.username;

    let isPlayingHalo2 = false;
    if (activities) {
        activities.forEach(activity => {
        if (activity.name === HALO2_ACTIVITY_NAME) {
            isPlayingHalo2 = true;
            guild.roles.fetch(getPlayingHalo2Role(guild.roles, guild.name)).then((playingHalo2Role) => {
            if (!discordMember.roles.cache.has(playingHalo2Role.id)) {
                discordMember.roles.add(playingHalo2Role).then(function() {
                console.log(`Role : Halo 2 given to ${chalk.bgBlueBright.bold(displayName)} in ${chalk.cyan.bgBlack(guild.name)}`);
                }).catch((error) => {
                console.log(error);
                console.log(`${chalk.red('Error')} trying to add halo 2 role for user ${chalk.bgBlueBright.bold(displayName)} in ${chalk.cyan.bgBlack(guild.name)}, error=${error}`);
                });
            }
            }).catch((error) => {
            console.log(error);
            console.log(`Could not find playing halo 2 role in ${chalk.cyan.bgBlack(guild.name)}} error=${error}`);
            });
        }
        });
    }

    if (!isPlayingHalo2) {
        checkAndRemoveHalo2Role(discordMember, guild.name);
    }
}

module.exports = { handlePresenceUpdate, removeStaleRoles };
