import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { CustomClient } from "../CustomClient.js";
export async function loadCommands(client, dir, slashData) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === "prefixCommands") {
                await loadCommandFiles(client, fullPath, "prefix", slashData);
            }
            else if (entry.name === "slashCommands") {
                await loadCommandFiles(client, fullPath, "slash", slashData);
            }
            else {
                // Recurse into other folders if needed
                await loadCommands(client, fullPath, slashData);
            }
        }
    }
}
async function loadCommandFiles(client, folderPath, type, slashData) {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(folderPath, entry.name);
        if (entry.isDirectory()) {
            // Recursively load nested folders
            await loadCommandFiles(client, fullPath, type, slashData);
        }
        else if (entry.isFile() && entry.name.endsWith(".js")) {
            const fileUrl = pathToFileURL(fullPath);
            const { default: command } = (await import(fileUrl.toJSON()));
            if (!command || command.type !== type)
                continue;
            if (type === "prefix") {
                const prefixCmd = command;
                client.prefixCommands.set(prefixCmd.name, prefixCmd);
                prefixCmd.aliases?.forEach((alias) => client.prefixCommands.set(alias, prefixCmd));
            }
            else if (type === "slash") {
                const slashCmd = command;
                client.slashCommands.set(slashCmd.data.name, slashCmd);
                slashData.push(slashCmd.data.toJSON());
            }
        }
    }
}
