const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ChannelType } = require("discord.js");
const channelType = [ChannelType.GuildVoice, ChannelType.GuildStageVoice]

module.exports = {
    name: "move",
    description: "Déconnecte un membre du salon vocal",
    arguments: "<member> <channel>",
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
        
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || await message.guild.channels.fetch(args[1]).catch(() => null)
        if (!channel || !args[1] || !channelType.includes(channel.type)) return message.channel.send("Veuillez mentionner un salon vocal valide")

        member.voice.setChannel(channel)
            .then(() => message.channel.send(`${member.user.username} a été deplace vers ${channel}`))
            .catch(() => message.channel.send(`Je ne peux pas deplacer ${member}`))
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction
    */
    async executeSlash(client, interaction, db) {
        const member = interaction.options.getMember('member');
        const channel = interaction.options.getChannel('channel');
        
        if (!member) return interaction.reply({ content: `Aucun membre de trouvé`, ephemeral: true });

        if (!member.voice.channel) return interaction.reply({ content: `${member.user.username} n'est connecté dans aucun salon vocal`, ephemeral: true });
        
        if (!channel || !channelType.includes(channel.type)) return interaction.reply({ content: "Veuillez mentionner un salon vocal valide", ephemeral: true });

        member.voice.setChannel(channel)
            .then(() => interaction.reply({ content: `${member.user.username} a été deplace vers ${channel}`, ephemeral: true }))
            .catch(() => interaction.reply({ content: `Je ne peux pas deplacer ${member}`, ephemeral: true }))
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.slashName ?? this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(this.permissions.length ? this.permissions[0] : 0)
            .addUserOption(option =>
                option.setName('member')
                    .setDescription('Membre à déplacer')
                    .setRequired(true)
            )
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Salon vocal de destination')
                    .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
                    .setRequired(true)
            )
    }
}
