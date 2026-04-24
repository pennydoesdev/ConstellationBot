import { REST, Routes } from 'discord.js';
import { config } from '../config.js';
import { commands } from './index.js';

async function main(): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(config.discord.token);
  const body = commands.map((c) => c.data.toJSON());

  if (config.discord.guildId) {
    const route = Routes.applicationGuildCommands(config.discord.appId, config.discord.guildId);
    await rest.put(route, { body });
    console.log(
      `✓ Registered ${body.length} command(s) to guild ${config.discord.guildId} ` +
      `(appears instantly)`
    );
  } else {
    const route = Routes.applicationCommands(config.discord.appId);
    await rest.put(route, { body });
    console.log(
      `✓ Registered ${body.length} global command(s) ` +
      `(can take up to 1h to appear in all guilds)`
    );
  }

  console.log('\nCommands registered:');
  for (const c of body) {
    console.log(`  /${c.name} — ${c.description}`);
  }
}

main().catch((err) => {
  console.error('✗ Failed to register commands:');
  console.error(err);
  process.exit(1);
});
