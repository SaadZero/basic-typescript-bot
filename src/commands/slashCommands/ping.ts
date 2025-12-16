import { SlashCommandBuilder } from "discord.js";
import type { slashCommand } from "../../types/commands.js";

const command: slashCommand = {
    description: "A test command",
    type: "slash",
    data: new SlashCommandBuilder().setName("ping").setDescription("Pong"),
    async execute(interaction) {
        await interaction.deferReply();

        await interaction.editReply("HI");
    },
}

export default command;