# discord-nft-floor-price

display the floor price for an opensea/solanart nft collection in your discord sidebar

![image](https://user-images.githubusercontent.com/7338312/140234112-09a067fc-a074-462e-87f9-c4df655d63a3.png)

## running

configuration is done via ENV vars and CMD:

- DISCORD_BOT_TOKEN: the token for your discord bot
- SLUG: the collection name from OpenSea or Solanart
- NICKNAME: set price in nickname rather than activity
- FREQUENCY: ms to update price

then pass the marketplace to use, either `opensea` or `solanart` currently

```shell
docker run -e SLUG='creature-world-collection' -e DISCORD_BOT_TOKEN='XXXXXXXXXXXXXXXXXXXXX' ghcr.io/rssnyder/discord-nft-floor-price:0.2.0 opensea
```

```yaml
---
version: "3"
services:
  creature-world-collection:
    image: ghcr.io/rssnyder/discord-nft-floor-price:0.2.0
    restart: always
    cap_add:
      - SYS_ADMIN
    environment:
      - DISCORD_BOT_TOKEN=XXXXXXXXXXXXXXXXXXXXX
      - SLUG=creature-world-collection
```
