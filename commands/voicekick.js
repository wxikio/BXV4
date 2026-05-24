const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Déconnecte un membre du salon vocal",
    arguments: "<member>",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    async execute(client, message, args, db) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.channel.send(`Aucun membre de trouvé pour \`${args[0] || "rien"}\``)

        if (!member.voice.channel) return message.channel.send(`${member.user.username} n'est connecté dans aucun salon vocal`)

        member.voice.disconnect()
            .then(() => message.channel.send(`${member.user.username} a été déconnecté`))
            .catch(() => message.channel.send(`Je ne peux pas déconnecter ${member}`))
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction
    */
    async executeSlash(client, interaction, db) {
        const member = interaction.options.getMember('member');
        
        if (!member) return interaction.reply({ content: `Membre introuvable`, flags: 64 });

        if (!member.voice.channel) return interaction.reply({ content: `${member.user.username} n'est connecté dans aucun salon vocal`, flags: 64 });

        member.voice.disconnect()
            .then(() => interaction.reply({ content: `${member.user.username} a été déconnecté`, flags: 64 }))
            .catch(() => interaction.reply({ content: `Je ne peux pas déconnecter ${member}`, flags: 64 }))
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.slashName ?? this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(this.permissions.length ? this.permissions[0] : 0)
            .addUserOption(option =>
                option.setName('member')
                    .setDescription('Membre à déconnecter')
                    .setRequired(true)
            )
    }
}
