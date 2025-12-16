import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import type { ApplicationCommandDataResolvable } from "discord.js";
import { CustomClient } from "../CustomClient.js";
import type { prefixCommand, slashCommand } from "../types/commands.js";

type Command = prefixCommand | slashCommand;

export async function loadCommands(
  client: CustomClient,
  dir: string,
  slashData: ApplicationCommandDataResolvable[]
) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
        // console.log(entry)
      if (entry.name === "prefixCommands") {
        await loadCommandFiles(client, fullPath, "prefix", slashData);
      } else if (entry.name === "slashCommands") {
        await loadCommandFiles(client, fullPath, "slash", slashData);
      } else {
        // Recurse into other folders if needed
        await loadCommands(client, fullPath, slashData);
      }
    }
  }
}

async function loadCommandFiles(
  client: CustomClient,
  folderPath: string,
  type: "prefix" | "slash",
  slashData: ApplicationCommandDataResolvable[]
) {
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    // console.log(slashData)

    if (entry.isDirectory()) {
      // Recursively load nested folders
      await loadCommandFiles(client, fullPath, type, slashData);
    } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".ts"))) {
      const fileUrl = pathToFileURL(fullPath);
      const { default: command } = (await import(`${fileUrl}`)) as { default: Command };
        // console.log(command)
      if (!command || command.type !== type) continue;

      if (type === "prefix") {
        const prefixCmd = command as prefixCommand;
        client.prefixCommands.set(prefixCmd.name, prefixCmd);
        prefixCmd.aliases?.forEach((alias) => client.prefixCommands.set(alias, prefixCmd));
      } else if (type === "slash") {
        const slashCmd = command as slashCommand;
        client.slashCommands.set(slashCmd.data.name, slashCmd);
        slashData.push(slashCmd.data.toJSON());
      }
    }
  }
}
