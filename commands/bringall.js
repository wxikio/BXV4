const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ChannelType } = require("discord.js");

module.exports = {
    name: "bringall",
    description: "Déplace tous les membres du salon vocale dans un salon",
    arguments: "<channel>",
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
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || await message.guild.channels.fetch(args[0]).catch(() => null);
        const channelType = [ChannelType.GuildVoice, ChannelType.GuildStageVoice];

        if (!channel || !args[0] || !channelType.includes(channel.type)) return message.channel.send("Veuillez mentionner un salon vocal valide");

        let i = 0;

        message.guild.members.cache.filter(m => !m.user.bot && m.voice.channel).forEach(member => {
            try {
                member.voice.setChannel(channel);
                i++;
            } catch { false }
        });

        message.channel.send(`${i} membres ont été déplacés dans ${channel}`);
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction
    */
    async executeSlash(client, interaction, db) {
        const channel = interaction.options.getChannel('channel');
        const channelType = [ChannelType.GuildVoice, ChannelType.GuildStageVoice];

        if (!channel || !channelType.includes(channel.type)) 
            return interaction.reply({ content: "Veuillez mentionner un salon vocal valide", flags: 64 });
        
        await interaction.deferReply();

        let i = 0;

        interaction.guild.members.cache.filter(m => !m.user.bot && m.voice.channel).forEach(member => {
            try {
                member.voice.setChannel(channel);
                i++;
            } catch { false }
        });

        interaction.editReply({ content: `${i} membres ont été déplacés dans ${channel}`, flags: 64 });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.slashName ?? this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(this.permissions.length ? this.permissions[0] : 0)
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Salon vocal de destination')
                    .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
                    .setRequired(true)
            )
    }
};
