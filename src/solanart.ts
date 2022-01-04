import {Client} from 'discordx';
import {Guild} from 'discord.js';
const axios = require('axios');

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

async function getCollection() {
  try {
    const response = await axios.get(`https://qzlsklfacc.medianetwork.cloud/get_nft?collection=${process.env.SLUG}&page=0&limit=30&order=&fits=any&trait=&search=&min=0&max=0&listed=true&ownedby=&attrib_count=&bid=all`, {
      headers: {
          "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0",
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "cross-site"
      },
      referrer: "https://solanart.io/",
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

client.once('ready', async () => {
  await client.initApplicationPermissions(true);

  console.log(`watching ${process.env.SLUG}`);

  const guilds = client.guilds.cache;

  console.log('Bot started');

  while (true) {

    const basicInfo = await getCollection()
    console.log(basicInfo);

    if (process.env.NICKNAME) {
      await client.user?.setActivity(process.env.SLUG || 'solanart.io', {type: 'WATCHING'});

      guilds.map(async (guild: Guild) => {
        const name = `${basicInfo.data.pagination.floorPriceFilters} SOL`
        console.log(`changing name in ${guild}: ${name}`);
        try {
          await guild.me?.setNickname(name);
          console.log(`changed nickname in ${guild}`);
        } catch (DiscordAPIError) {
          console.log(`unable to change nickname in ${guild}: ${DiscordAPIError}`);
        }
      });
    } else {
      await client.user?.setActivity(`Floor: ${basicInfo.data.pagination.floorPriceFilters} SOL`, {type: 'WATCHING'});
      console.log(`updated activity`);
    }

    await delay(parseInt(process.env.FREQUENCY || '3600000'));
  }
});

client.login(process.env.DISCORD_BOT_TOKEN ?? '');
