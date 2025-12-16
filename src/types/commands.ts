import type { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";

export interface slashCommand {
    description: string;
    type: "slash";
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<any>
}

export interface prefixCommand {
    name: string;
    type: "prefix";
    description: string;
    cooldown?: number;
    aliases?: string[];
    execute: (message: Message) => Promise<any>
}