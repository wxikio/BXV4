const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ChannelType } = require("discord.js");

module.exports = {
    name: "voicemove",
    description: "Déplace les membres d'un salon vocal vers un autre salon vocal",
    arguments: "<channel1> <channel2>",
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
        const channel2 = message.mentions.channels.array()[1] || message.guild.channels.cache.get(args[1]) || await message.guild.channels.fetch(args[1]).catch(() => null)
        const channelType = [ChannelType.GuildVoice, ChannelType.GuildStageVoice]
        
        if (!channel || !args[0] || !channelType.includes(channel.type)) return message.channel.send("Veuillez mentionner un salon vocal valide")
        if (!channel2 || !args[1] || !channelType.includes(channel2.type)) return message.channel.send("Veuillez mentionner un autre salon vocal valide")
                
        if (channel.members.filter(m => !m.user?.bot).size === 0) return message.channel.send("Il n'y aucun membre dans ce salon vocal")

        let i = 0

        for (const member of channel.members.filter(m => !m.user?.bot).map(r => r)){
            try {
                await member.voice.setChannel(channel2)
                i++;
            }
            catch { false }
        }

        message.channel.send(`${i} membres ont été déplacés dans ${channel2}`)
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction
    */
    async executeSlash(client, interaction, db) {
        const channel = interaction.options.getChannel('salon');
        const channel2 = interaction.options.getChannel('salon2');
        const channelType = [ChannelType.GuildVoice, ChannelType.GuildStageVoice];
        
        if (!channel || !channelType.includes(channel.type)) 
            return interaction.reply({ content: "Veuillez mentionner un salon vocal valide", flags: 64 });
        
        if (!channel2 || !channelType.includes(channel2.type)) 
            return interaction.reply({ content: "Veuillez mentionner un autre salon vocal valide", flags: 64 });
        
                
        if (channel.members.filter(m => !m.user?.bot).size === 0) 
            return interaction.reply({ content: "Il n'y a aucun membre dans ce salon vocal", flags: 64 });
        
        await interaction.deferReply();

        let i = 0;

        for (const member of channel.members.filter(m => !m.user?.bot).map(r => r)){
            try {
                await member.voice.setChannel(channel2);
                i++;
            }
            catch { false }
        }

        interaction.editReply({ content: `${i} membres ont été déplacés dans ${channel2}`, flags: 64 });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.slashName ?? this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(this.permissions.length ? this.permissions[0] : 0)
            .addChannelOption(option =>
                option.setName('salon')
                    .setDescription('Salon vocal source')
                    .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
                    .setRequired(true)
            )
            .addChannelOption(option =>
                option.setName('salon2')
                    .setDescription('Salon vocal de destination')
                    .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
                    .setRequired(true)
            )
    }
}