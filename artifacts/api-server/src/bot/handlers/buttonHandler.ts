import { ButtonInteraction, MessageFlags } from "discord.js";
import { logger } from "../../lib/logger.js";

// Track poll votes: messageId -> { optionIndex -> Set of userIds }
const pollVotes = new Map<string, Map<number, Set<string>>>();

export async function handleButton(interaction: ButtonInteraction) {
  const id = interaction.customId;
  const guild = interaction.guild;

  if (!guild) {
    await interaction.reply({ content: "Could not process your request.", flags: MessageFlags.Ephemeral });
    return;
  }

  // Fetch the full GuildMember to get typed role manager
  const member = await guild.members.fetch(interaction.user.id).catch(() => null);

  if (!member) {
    await interaction.reply({ content: "Could not find your member data.", flags: MessageFlags.Ephemeral });
    return;
  }

  // ===== VERIFY =====
  if (id === "verify_button") {
    const verifiedRole = guild.roles.cache.find((r) => r.name === "Verified");
    if (!verifiedRole) {
      await interaction.reply({
        content: "Verified role not found. Run `/setup` first.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (member.roles.cache.has(verifiedRole.id)) {
      await interaction.reply({ content: "You are already verified!", flags: MessageFlags.Ephemeral });
      return;
    }

    await member.roles.add(verifiedRole);
    await interaction.reply({ content: "✅ You have been verified and can now access the server!", flags: MessageFlags.Ephemeral });
    logger.info({ user: interaction.user.tag }, "User verified");
    return;
  }

  // ===== GAME ROLES =====
  const roleMap: Record<string, string> = {
    role_killer: "Killer",
    role_survivor: "Survivor",
    role_spectator: "Spectator",
    ping_game_updates: "Game Updates Ping",
    ping_dev_log: "Dev Log Ping",
  };

  if (id in roleMap) {
    const roleName = roleMap[id]!;
    const role = guild.roles.cache.find((r) => r.name === roleName);

    if (!role) {
      await interaction.reply({
        content: `Role "${roleName}" not found. Run \`/setup\` first.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const hasRole = member.roles.cache.has(role.id);
    if (hasRole) {
      await member.roles.remove(role);
      await interaction.reply({ content: `Removed the **${roleName}** role.`, flags: MessageFlags.Ephemeral });
    } else {
      await member.roles.add(role);
      await interaction.reply({ content: `Gave you the **${roleName}** role!`, flags: MessageFlags.Ephemeral });
    }
    return;
  }

  // ===== POLL VOTES =====
  if (id.startsWith("poll_vote_")) {
    const optionIndex = parseInt(id.replace("poll_vote_", ""), 10);
    const messageId = interaction.message.id;
    const userId = interaction.user.id;

    if (!pollVotes.has(messageId)) {
      pollVotes.set(messageId, new Map());
    }
    const votes = pollVotes.get(messageId)!;

    // Remove previous vote from other options
    for (const [idx, voters] of votes) {
      if (idx !== optionIndex && voters.has(userId)) {
        voters.delete(userId);
      }
    }

    if (!votes.has(optionIndex)) {
      votes.set(optionIndex, new Set());
    }

    const optionVoters = votes.get(optionIndex)!;
    if (optionVoters.has(userId)) {
      optionVoters.delete(userId);
      await interaction.reply({ content: "Removed your vote.", flags: MessageFlags.Ephemeral });
    } else {
      optionVoters.add(userId);
      const total = [...votes.values()].reduce((sum, s) => sum + s.size, 0);
      await interaction.reply({ content: `Voted! Total votes: **${total}**`, flags: MessageFlags.Ephemeral });
    }
    return;
  }

  await interaction.reply({ content: "Unknown button.", flags: MessageFlags.Ephemeral });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const member = interaction.member;
    const guild = interaction.guild;

    function hasRole(name) {
      return member.roles.cache.some(r => r.name === name);
    }

    async function toggleRole(roleName) {
      const role = guild.roles.cache.find(r => r.name === roleName);
      if (!role) return;

      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        return false;
      } else {
        await member.roles.add(role);
        return true;
      }
    }

    // ===== PING ROLES =====
    if (interaction.customId === 'update_ping') {
      const added = await toggleRole('Update Ping');
      return interaction.reply({ content: added ? '✅ Update Ping ON' : '❌ Update Ping OFF', ephemeral: true });
    }

    if (interaction.customId === 'events_ping') {
      const added = await toggleRole('Events Ping');
      return interaction.reply({ content: added ? '✅ Events Ping ON' : '❌ Events Ping OFF', ephemeral: true });
    }

    if (interaction.customId === 'announce_ping') {
      const added = await toggleRole('Announcements Ping');
      return interaction.reply({ content: added ? '✅ Announcements Ping ON' : '❌ Announcements Ping OFF', ephemeral: true });
    }

    // ===== ACCESS SYSTEM =====

    // COMMUNITY (Lv 5)
    if (interaction.customId === 'community_access') {
      if (!hasRole('Lv 5')) {
        return interaction.reply({ content: '❌ Requires Lv 5', ephemeral: true });
      }

      const added = await toggleRole('Community Access');
      return interaction.reply({ content: added ? '✅ Community Unlocked' : '❌ Removed', ephemeral: true });
    }

    // NICKNAME (Lv 10)
    if (interaction.customId === 'nickname_perm') {
      if (!hasRole('Lv 10')) {
        return interaction.reply({ content: '❌ Requires Lv 10', ephemeral: true });
      }

      const added = await toggleRole('Nickname Perms');
      return interaction.reply({ content: added ? '✅ Nicknames Enabled' : '❌ Removed', ephemeral: true });
    }

    // IMAGE (Lv 15)
    if (interaction.customId === 'image_perm') {
      if (!hasRole('Lv 15')) {
        return interaction.reply({ content: '❌ Requires Lv 15', ephemeral: true });
      }

      const added = await toggleRole('Image Perms');
      return interaction.reply({ content: added ? '✅ Images Enabled' : '❌ Removed', ephemeral: true });
    }
  });
}
