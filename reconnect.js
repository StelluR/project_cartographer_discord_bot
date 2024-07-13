const axios = require('axios');
const dns = require('dns');
const chalk = require('chalk');

async function resolveIPV4(domain)
{
    return new Promise((resolve, reject) => {
        dns.resolve4(domain, (err, addresses) => {
            resolve(addresses[0]);
        });
    });

}
async function checkIPV4Connection(domain = 'google.com', timeout = 5000) 
{
	try {
        const ipv4Address = await resolveIPV4(domain);
	    const response = await axios.get(`http://${ipv4Address}`, { timeout });
	    return response.status === 200;
	} catch (error) {
	    return false;
	}
}

async function tryToLogin(client, token) 
{
	while (true) {
	  const isConnected = await checkIPV4Connection();
	  if (isConnected) {
		console.log(chalk.green('Internet connection available. Attempting to login.'));
		try {
		  await client.login(token);
		  break;
		} catch (error) {
		  console.error(chalk.red('An error occurred during login:', error));
		  client.destroy();
		}
	  } else {
		console.log(chalk.yellow('No internet connection. Retrying in 30 seconds...'));
		await new Promise(resolve => setTimeout(resolve, 30000));
	  }
	}
}

module.exports = { tryToLogin };