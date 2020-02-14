// Import the discord.js module
const Discord = require("discord.js");

const STRATS = require("./strats.json");

require("dotenv").config();

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on("ready", () => {
  console.log("I am ready!");
});

// Create an event listener for messages
client.on("message", message => {
  if (message.content.startsWith("/gostrats")) {
    try {
      console.log(JSON.stringify(message.content.split(" ")));
      if (message.content.split(" ").length < 3) {
        message.channel.send("Need a strat? Try `/gostrats [map] [# players]`");
        message.channel.send(`-- maps: ${Object.keys(STRATS).join(", ")}`);

        return;
      }

      const [command, map, playerCountStr] = message.content.split(" ");
      const playerCount = Number.parseInt(playerCountStr);

      message.channel.send(`Fetching strat for ${map} - ${playerCount}...`);

      if (STRATS[map]) {
        const theseStrats = STRATS[map][playerCount - 1];
        console.log("theseStrats: ", theseStrats);
        if (
          theseStrats &&
          Array.isArray(theseStrats) &&
          theseStrats.length > 0
        ) {
          const { overview, players } = theseStrats[
            Math.floor(Math.random() * theseStrats.length)
          ];

          message.channel.send(overview);
          console.log(players, playerCount);
          players.forEach((playerStrat, index) =>
            message.channel.send(`--- ${index + 1}: ${playerStrat}`)
          );
        } else {
          message.channel.send(
            `No strats for '${playerCount}' players on map '${map}'`
          );
        }
      } else {
        message.channel.send(`Unable to find map '${map}'.`);
      }
    } catch (e) {
      console.log("error: ", e);
    }
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.CLIENT_TOKEN);
