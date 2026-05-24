const { SlashCommandBuilder, PermissionsBitField, Client, Message, Interaction, ChannelType } = require("discord.js");

module.exports = {
    name: "voiceunmuteall",
    description: "Unmute tous les utilisateurs present dans le salon vocale",
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

        if (!message.member.voice?.channelId) return message.channel.send("Veuillez utiliser cette commande une fois un salon vocale rejoint");
        if (message.member.voice.channel.members.filter(m => !m.user?.bot).size === 0) return message.channel.send("Il n'y aucun membre dans ce salon vocal")

        let i = 0

        for (const member of message.member.voice.channel.members.filter(m => !m.user?.bot).values()) {
            try {
                await member.voice.selfMute(false)
                i++;
            }
            catch { false }
        }

        message.channel.send(`${i} membres ont été unmutes`)
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction
    */
    async executeSlash(client, interaction, db) {
        if (!interaction.member.voice?.channelId)
            return interaction.reply({ content: "Veuillez utiliser cette commande une fois un salon vocale rejoint", ephemeral: true });

        if (interaction.member.voice.channel.members.filter(m => !m.user?.bot).size === 0)
            return interaction.reply({ content: "Il n'y aucun membre dans ce salon vocal", ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        let i = 0;

        for (const member of interaction.member.voice.channel.members.filter(m => !m.user?.bot).values()) {
            try {
                await member.voice.setMute(false);
                i++;
            }
            catch { false }
        }

        interaction.editReply({ content: `${i} membres ont été unmutes` });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.slashName ?? this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(this.permissions.length ? this.permissions[0] : 0)
    }
}