const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ChannelType } = require("discord.js");
const channelType = [ChannelType.GuildVoice, ChannelType.GuildStageVoice]

module.exports = {
    name: "voicemoveall",
    description: "Déplace les membres de tous les salons vocaux vers un autre salon vocal",
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

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || await message.guild.channels.fetch(args[0]).catch(() => null)
        if (!channel || !args[0] || !channelType.includes(channel.type)) return message.channel.send("Veuillez mentionner un salon vocal valide")

        let i = 0

        for (const member of message.guild.members.cache.filter(m => m.voice?.channelId && m.voice.channelId !== channel.id).values()){
            try {
                await member.voice.setChannel(channel)
                i++;
            }
            catch { false }
        }

        message.channel.send(`${i} membres ont été déplacés dans ${channel}`)
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction
    */
    async executeSlash(client, interaction, db) {
        const channel = interaction.options.getChannel('salon');
        
        if (!channel || !channelType.includes(channel.type)) 
            return interaction.reply({ content: "Veuillez mentionner un salon vocal valide", ephemeral: true });
        
        await interaction.deferReply({ ephemeral: true });

        let i = 0;

        for (const member of interaction.guild.members.cache.filter(m => m.voice?.channelId && m.voice.channelId !== channel.id).values()){
            try {
                await member.voice.setChannel(channel);
                i++;
            }
            catch { false }
        }

        interaction.editReply({ content: `${i} membres ont été déplacés dans ${channel}` });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.slashName ?? this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(this.permissions.length ? this.permissions[0] : 0)
            .addChannelOption(option =>
                option.setName('salon')
                    .setDescription('Salon vocal de destination')
                    .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
                    .setRequired(true)
            )
    }
}