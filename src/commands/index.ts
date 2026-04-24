import type { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';
import * as ping from './ping.js';

export interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

// All commands register themselves here. To add a new command:
//   1. Create src/commands/<name>.ts exporting `data` and `execute`
//   2. Import and add to the `commands` array below
//   3. Run `npm run register` to push the new definition to Discord
export const commands: Command[] = [ping];

export const commandMap = new Map<string, Command>(
  commands.map((c) => [c.data.name, c])
);
