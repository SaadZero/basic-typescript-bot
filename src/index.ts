import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { CustomClient } from "./CustomClient.js";
import {
	GatewayIntentBits,
	Partials,
	REST,
	Routes,
	type APIApplicationCommand,
	type ApplicationCommandDataResolvable,
    type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { loadCommands } from "./utils/loadCommands.js";
import "dotenv/config"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new CustomClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
	partials: [Partials.Message, Partials.GuildMember],
});

const slashData: ApplicationCommandDataResolvable[] = [];

const commandsPath = path.join(__dirname, "commands");
const commandsFile = fs.readdirSync(commandsPath);
// console.log(process.env.TOKEN)

// loadCommands(client, commandsPath, slashData);

const rest = new REST().setToken(process.env.TOKEN);
(async () => {
	try {
        await loadCommands(client, commandsPath, slashData);    
		const data: APIApplicationCommand[] = (await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, "1229480488461271095"),
            {body: slashData as RESTPostAPIApplicationCommandsJSONBody[]}
		)) as APIApplicationCommand[];
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (e) {}
})();

client.login(process.env.TOKEN);

client.once("clientReady", async (client) => {
    console.log(`Logged in as ${client.user.username}`)
})

client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(process.env.PREFIX)) return;
    const args = message.content.split("=");
    const command = args[1];
    // console.log(args);
    if (command && client.prefixCommands.has(command)) {
        const prefixCommand = client.prefixCommands.get(command);
        try {
            await prefixCommand?.execute(message);
        } catch (e) {
            console.log(e);
        }
    }
});

client.on("interactionCreate", async (interaction) => {
    
    if (interaction.isChatInputCommand()) {
        const commandName = interaction.commandName;

        const command = client.slashCommands.get(commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (e) {
            console.log(e);
        }
        
    }
})
