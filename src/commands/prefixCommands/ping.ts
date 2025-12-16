import type { prefixCommand } from "../../types/commands.js";

const command: prefixCommand = {
    name: "ping",
    type: "prefix",
    description: "A test command to ping",
    async execute(message) {
        await message.reply({content: "HELLO MELLO"});
    },
}

export default command