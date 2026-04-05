const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panels')
    .setDescription('Send all role panels'),

  async execute(interaction: { guild: any; member: { roles: { cache: { has: (arg0: any) => any; }; }; }; reply: (arg0: { content: string; ephemeral: boolean; }) => any; }) {
    const guild = interaction.guild;

    // OWNER CHECK
    const ownerRole = guild.roles.cache.find((r: { name: string; }) => r.name === 'Owner');
    if (!interaction.member.roles.cache.has(ownerRole.id)) {
      return interaction.reply({ content: '❌ Owner only!', ephemeral: true });
    }

    // ===== PING PANEL =====
    const pingEmbed = new EmbedBuilder()
      .setTitle('🔔 Ping Roles')
      .setDescription('Toggle notifications');

    const pingRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('update_ping').setLabel('Updates').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('events_ping').setLabel('Events').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('announce_ping').setLabel('Announcements').setStyle(ButtonStyle.Secondary)
    );

    const pingChannel = guild.channels.cache.find(c => c.name === 'ping-roles');
    if (pingChannel) await pingChannel.send({ embeds: [pingEmbed], components: [pingRow] });

    // ===== ACCESS PANELS =====

    const accessChannel = guild.channels.cache.find(c => c.name === 'access-roles');

    // COMMUNITY ACCESS
    const communityEmbed = new EmbedBuilder()
      .setTitle('🌐 Community Access')
      .setDescription('Requires Lv 5');

    const communityRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('community_access').setLabel('Unlock Community').setStyle(ButtonStyle.Primary)
    );

    // NICKNAME PERMS
    const nickEmbed = new EmbedBuilder()
      .setTitle('✏️ Nickname Permissions')
      .setDescription('Requires Lv 10');

    const nickRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('nickname_perm').setLabel('Enable Nicknames').setStyle(ButtonStyle.Secondary)
    );

    // IMAGE PERMS
    const imageEmbed = new EmbedBuilder()
      .setTitle('🖼️ Image Permissions')
      .setDescription('Requires Lv 15');

    const imageRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('image_perm').setLabel('Enable Images').setStyle(ButtonStyle.Success)
    );

    if (accessChannel) {
      await accessChannel.send({ embeds: [communityEmbed], components: [communityRow] });
      await accessChannel.send({ embeds: [nickEmbed], components: [nickRow] });
      await accessChannel.send({ embeds: [imageEmbed], components: [imageRow] });
    }

    await interaction.reply({ content: '✅ Panels sent!', ephemeral: true });
  },
};