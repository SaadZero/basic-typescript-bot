import { Client, Collection, type ClientOptions } from "discord.js";
import type { prefixCommand, slashCommand } from "./types/commands.js";

export class CustomClient extends Client {
    public slashCommands: Collection<string, slashCommand>;
    public prefixCommands: Collection<string, prefixCommand>;

    constructor(options: ClientOptions) {
        super(options);
        this.slashCommands = new Collection();
        this.prefixCommands = new Collection();
    }
}