import { Client, Collection } from "discord.js";
export class CustomClient extends Client {
    slashCommands;
    prefixCommands;
    constructor(options) {
        super(options);
        this.slashCommands = new Collection();
        this.prefixCommands = new Collection();
    }
}
