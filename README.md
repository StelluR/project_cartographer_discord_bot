## Prerequisites
1. You will need to create a discord bot (do this at https://discord.com/developers/applications)
2. Give the bot the "bot" role and "Manage Roles" permission, copy the oauth url it gives, and authorize it for your discord server
3. Make sure the role you give the bot in your discord is above all your users and make sure it also has "Manage Roles" permission checked
 
## Setup
1. Clone this repository
2. Copy config.json.sample and rename config.json
3. Enter your discord bot token (you get this from the discord bot developer section)

## Usage
### Manually with nodejs
1. Install nodejs on your OS
2. Run the following command (in git directory) to install all necessary packages
```bash
npm install
``` 
3. Run the following command (in git directory) to run the bot
```bash
node bot.js
``` 
#### Using pm2 process manager (must follow steps 1 & 2 on manual nodejs install first)
1. If on Windows, follow https://github.com/jessety/pm2-installer to install pm2-installer in order to automatically start pm2 upon server reboot.\
More information about pm2 startup can be found here: https://pm2.keymetrics.io/docs/usage/startup/
2. Run the following commands to start the bot via pm2:
```bash
pm2 start <path to bot.js> --name "cartographer_rolebot" --log-date-format="YYYY-MM-DD HH:mm:ss Z" -- --color
pm2 save
```
3. If using Linux/MacOS run:
```bash
pm2 startup
```
4. To see logs:
```
pm2 logs cartographer_rolebot
```

### Docker
1. Install docker on your OS
2. Run following command to build the docker image in git directory
```bash
docker build -t discord-bot .
```
3. Run following command to run the newly created image
```bash
docker run -d discord-bot
```
4. To see logs
```bash
docker logs <container-name>
```

## Original Credits
https://github.com/pnill

https://github.com/num0005

https://github.com/bigtweekx

https://github.com/StelluR
