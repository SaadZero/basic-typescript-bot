import { SlashCommandBuilder } from "discord.js";
const command = {
    description: "A test command",
    type: "slash",
    data: new SlashCommandBuilder().setName("ping").setDescription("Pong"),
    async execute(interaction) {
        await interaction.deferReply();
        await interaction.reply("HI");
    },
};
