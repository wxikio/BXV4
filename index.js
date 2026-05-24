const { ActivityType, Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");

const TOKEN = process.env.TOKEN;
if (!TOKEN) { console.error("❌ TOKEN manquant dans les variables Railway."); process.exit(1); }

const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildExpressions, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ],
    partials: [ Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User ],
    restTimeOffset: 0,
    failIfNotExists: false,
    presence: {
        activities: [{ name: "Voice Bot", type: ActivityType.Streaming, url: "https://twitch.tv/placeholder" }],
        status: "dnd"
    },
    allowedMentions: { parse: ["roles", "users", "everyone"], repliedUser: false }
});

client.config = require("./config.json");
client.token = TOKEN;

const eventFiles = fs.readdirSync("./events").filter(f => f.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) client.once(event.name, (...args) => event.execute(client, ...args));
    else client.on(event.name, (...args) => event.execute(client, ...args));
}

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

async function errorHandler(error) {
    if (error.code == 10062) return;
    if (error.code == 40060) return;
    console.log(`[ERROR] ${error}`);
}

process.on("unhandledRejection", errorHandler);
process.on("uncaughtException", errorHandler);

client.login(TOKEN);
