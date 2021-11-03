import {Client} from 'discordx';
import {Guild} from 'discord.js';

const OpenseaScraper = require('opensea-scraper');

const client = new Client({
  intents: ['GUILDS'],
  silent: true,
});

/**
 * sleep - i am not a ts dev
 * @param {number} ms milliseconds to sleep
 * @return {Promise} promise
 */
function delay(ms: number) {
  return new Promise( (resolve) => setTimeout(resolve, ms) );
}

client.once('ready', async () => {
  await client.initApplicationPermissions(true);

  const basicInfo = await OpenseaScraper.basicInfo(process.env.SLUG);
  console.log(`watching ${basicInfo.name}`);

  await client.user?.setActivity(basicInfo.name, {type: 'WATCHING'});

  const guilds = client.guilds.cache;

  console.log('Bot started');

  while (true) {
    guilds.map(async (guild: Guild) => {
      console.log(`changing name in ${guild}`);
      const floorPrice = await OpenseaScraper.floorPrice(process.env.SLUG);
      try {
        await guild.me?.setNickname(
            `${floorPrice.amount} ${floorPrice.currency}`,
        );
        console.log(`changed nickname in ${guild}`);
      } catch (DiscordAPIError) {
        console.log(`unable to change nickname in ${guild}`);
      }
    });
    await delay(parseInt(process.env.FREQUENCY || '3600000'));
  }
});

client.login(process.env.DISCORD_BOT_TOKEN ?? '');
