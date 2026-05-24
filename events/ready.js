const { Routes, Client } = require('discord.js');
const { REST } = require('@discordjs/rest');

module.exports = {
    name: "clientReady",
    once: true,
    /**
     * @param {Client} client
    */
    async execute(client) {
        console.log(`[READY] ${client.user.tag} (${client.user.id}) est prêt | ${client.guilds.cache.size.toLocaleString('fr-FR')} serveurs | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString('fr-FR')} utilisateurs`);
    
        const rest = new REST({ version: '10' }).setToken(client.token);

        rest.put(
            // Routes.applicationGuildCommands(client.user.id, guildId), { body: client.config.slashs ? client.commands.map(r => r.data.toJSON()) : [] }
            Routes.applicationCommands(client.user.id), { body: client.config.slashs ? client.commands.map(r => r.data.toJSON()) : [] }
            )
            .then((data) => console.log(`[SLASH] ${data.length} commandes enregistrees.`))
            .catch(console.error);
    }
}