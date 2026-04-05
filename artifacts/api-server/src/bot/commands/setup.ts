import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Guild,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Build a Roblox Asym Discord server")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export function getOrCreateRole(guild: Guild, arg1: string) {
    throw new Error("Function not implemented.");
}

