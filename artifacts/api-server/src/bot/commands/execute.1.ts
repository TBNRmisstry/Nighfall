import { ChatInputCommandInteraction, MessageFlags, OverwriteType, PermissionFlagsBits, ChannelType, EmbedBuilder } from "discord.js";
import { getOrCreateRole } from "./setup";



export async function execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
        await interaction.reply({ content: "This command must be used in a server.", flags: MessageFlags.Ephemeral });
        return;
    }

    await interaction.reply({ content: "⚙️ Building your server... this may take a moment.", flags: MessageFlags.Ephemeral });

    const everyoneId = guild.roles.everyone.id;

    const readOnly = [
        {
            id: everyoneId,
            type: OverwriteType.Role,
            allow: [PermissionFlagsBits.ViewChannel],
            deny: [PermissionFlagsBits.SendMessages],
        },
    ];

    // ===== ROLES =====
    const verifiedRole = await getOrCreateRole(guild, 'verified');
    const unverifiedRole = await getOrCreateRole(guild, 'Unverified');
    const MemberRole = await getOrCreateRole(guild, 'Member');
    const devRole = await guild.roles.create({ name: "Developer", color: 0xed4245 });
    const ModRole = await guild.roles.create({ name: "Mod", color: 0xfee75c });
    const BotsRole = await guild.roles.create({ name: "Bots", color: 0xfee75c });
    const TrialModRole = await guild.roles.create({ name: "Trial Mod", color: 0xfee75c });
    const HeadModRole = await guild.roles.create({ name: "Head Mod", color: 0xfee75c });
    const HelperRole = await guild.roles.create({ name: "Helper", color: 0xed4245 });
    await guild.roles.create({ name: "Game Updates Ping", color: 0x5865f2 });
    await guild.roles.create({ name: "Dev Log Ping", color: 0x5865f2 });
    await getOrCreateRole(guild, 'sub annoucments Ping');
    await getOrCreateRole(guild, 'Announcements Ping');
    await getOrCreateRole(guild, 'Lv 5');
    await getOrCreateRole(guild, 'Lv 10');
    await getOrCreateRole(guild, 'Lv 15');
    await getOrCreateRole(guild, 'Lv 20');
    await getOrCreateRole(guild, 'Lv 25');
    await getOrCreateRole(guild, 'Lv 30');
    await getOrCreateRole(guild, 'Lv 35');
    await getOrCreateRole(guild, 'Lv 40');
    await getOrCreateRole(guild, 'Lv 45');
    await getOrCreateRole(guild, 'Lv 50');
    await getOrCreateRole(guild, 'Lv 55');
    await getOrCreateRole(guild, 'Lv 60');
    await getOrCreateRole(guild, 'Lv 65');
    await getOrCreateRole(guild, 'Lv 70');
    await getOrCreateRole(guild, 'Lv 75');
    await getOrCreateRole(guild, 'Lv 80');
    await getOrCreateRole(guild, 'Lv 85');
    await getOrCreateRole(guild, 'Lv 90');
    await getOrCreateRole(guild, 'Lv 95');
    await getOrCreateRole(guild, 'Lv 100');
    await getOrCreateRole(guild, 'Lv 110');
    await getOrCreateRole(guild, 'Lv 120');
    await getOrCreateRole(guild, 'Lv 130');
    await getOrCreateRole(guild, 'Lv 140');
    await getOrCreateRole(guild, 'Lv 150');
    await getOrCreateRole(guild, 'Lv 160');
    await getOrCreateRole(guild, 'Lv 170');
    await getOrCreateRole(guild, 'Lv 180');
    await getOrCreateRole(guild, 'Lv 190');
    await getOrCreateRole(guild, 'Lv 200');
    await getOrCreateRole(guild, 'Community Access');
    await getOrCreateRole(guild, 'Nickname Perms');
    await getOrCreateRole(guild, 'Image Perms');

    // ===== PRIVATE ZONES (no category) =====
    await guild.channels.create({
        name: "🔒dev-zone",
        type: ChannelType.GuildText,
        parent: (await guild.channels.create({ name: "📢 Important", type: ChannelType.GuildCategory })).id,
        permissionOverwrites: [
            { id: everyoneId, type: OverwriteType.Role, deny: [PermissionFlagsBits.ViewChannel] },
            { id: devRole.id, type: OverwriteType.Role, allow: [PermissionFlagsBits.ViewChannel] },
        ],
    });

    await guild.channels.create({
        name: "🔒game-zone",
        type: ChannelType.GuildText,
        parent: (await guild.channels.create({ name: "📢 Important", type: ChannelType.GuildCategory })).id,
        permissionOverwrites: [
            { id: everyoneId, type: OverwriteType.Role, deny: [PermissionFlagsBits.ViewChannel] },
            { id: ModRole.id, type: OverwriteType.Role, allow: [PermissionFlagsBits.ViewChannel] },
        ],
    });

    // ===== 📢 IMPORTANT =====
    for (const name of ["announcements", "sub-announcements", "update-log", "dev-log", "polls", "ugc", "socials"]) {
        await guild.channels.create({
            name,
            type: ChannelType.GuildText,
            parent: (await guild.channels.create({ name: "📢 Important", type: ChannelType.GuildCategory })).id,
            permissionOverwrites: readOnly,
        });
    }

    // ===== 📜 INFORMATION =====
    const info = await guild.channels.create({ name: "📜 Information", type: ChannelType.GuildCategory });
    for (const name of ["rules", "how-to-report-or-appeal", "faq", "ping-roles", "links", "access-roles"]) {
        await guild.channels.create({
            name,
            type: ChannelType.GuildText,
            parent: info.id,
            permissionOverwrites: readOnly,
        });
    }

    // ===== 🎮 GAME =====
    const game = await guild.channels.create({ name: "🎮 Game", type: ChannelType.GuildCategory });
    for (const name of ["queue", "lfg", "game-chat", "clips", "report-bugs", "suggestions"]) {
        await guild.channels.create({ name, type: ChannelType.GuildText, parent: game.id });
    }

    // ===== 💬 CHATS =====
    const chats = await guild.channels.create({ name: "💬 Chats", type: ChannelType.GuildCategory });
    for (const name of ["general", "bot-commands", "Nightfall", "creations"]) {
        await guild.channels.create({ name, type: ChannelType.GuildText, parent: chats.id });
    }

    // ===== 📂 COMMUNITY =====
    const community = await guild.channels.create({ name: "📂 Community", type: ChannelType.GuildCategory });
    for (const name of ["videos", "fan-art", "events", "poll-responses"]) {
        await guild.channels.create({
            name,
            type: ChannelType.GuildText,
            parent: community.id,
            permissionOverwrites: readOnly,
        });
    }

    // ===== 🔊 VOICE =====
    const voice = await guild.channels.create({ name: "🔊 Voice Chats", type: ChannelType.GuildCategory });
    for (const name of ["General 1", "General 2", "General 3", "General 4", "Level 15+", "AFK"]) {
        await guild.channels.create({ name, type: ChannelType.GuildVoice, parent: voice.id });
    }

    // ===== 🛠️ STAFF (HIDDEN) =====
    const staffCat = await guild.channels.create({
        name: "🛠️ Staff",
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            { id: everyoneId, type: OverwriteType.Role, deny: [PermissionFlagsBits.ViewChannel] },
        ],
    });
    for (const name of ["mod-chat", "reports", "logs"]) {
        await guild.channels.create({
            name,
            type: ChannelType.GuildText,
            parent: staffCat.id,
            permissionOverwrites: [
                { id: everyoneId, type: OverwriteType.Role, deny: [PermissionFlagsBits.ViewChannel] },
                { id: ModRole.id, type: OverwriteType.Role, allow: [PermissionFlagsBits.ViewChannel] },
            ],
        });
    }

    const embed = new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle("Server Setup Complete")
        .setDescription("Your Roblox Asym game server has been Created.")
        .addFields(
            { name: "Roles Created", value: "Verified, Developer, Staff, Killer, Survivor, Spectator, Ping roles" },
            { name: "Categories Created", value: "Important, Information, Game, Chats, Community, Voice, Staff" },
            { name: "Next Steps", value: "• Run `/announce` to post to your channels\n• Assign yourself the Staff or Developer role\n• Invite your community" }
        )
        .setTimestamp();

    await interaction.editReply({ content: "", embeds: [embed] });

    async function newFunction() {
        return await getOrCreateRole(guild, 'Verified');
    }
}
