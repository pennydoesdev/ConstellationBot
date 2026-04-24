import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { config } from './config.js';
import { commandMap } from './commands/index.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// ---- Ready -----------------------------------------------------------------
client.once(Events.ClientReady, (c) => {
  console.log(`✨ Constellation online as ${c.user.tag}`);
  console.log(`   Serving ${c.guilds.cache.size} guild(s)`);
  for (const guild of c.guilds.cache.values()) {
    console.log(`   - ${guild.name} (${guild.id}) · ${guild.memberCount} members`);
  }
  console.log(`   Environment: ${config.env}`);
});

// ---- Slash command dispatch -----------------------------------------------
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commandMap.get(interaction.commandName);
  if (!command) {
    console.warn(`Received unknown command: /${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Error executing /${interaction.commandName}:`, err);
    const errorContent = 'Something went wrong running that command. Staff have been notified.';
    if (interaction.replied || interaction.deferred) {
      await interaction
        .followUp({ content: errorContent, flags: MessageFlags.Ephemeral })
        .catch((e) => console.error('followUp failed:', e));
    } else {
      await interaction
        .reply({ content: errorContent, flags: MessageFlags.Ephemeral })
        .catch((e) => console.error('reply failed:', e));
    }
  }
});

// ---- Unhandled errors ------------------------------------------------------
client.on(Events.Error, (err) => {
  console.error('Discord client error:', err);
});
client.on(Events.ShardError, (err, shardId) => {
  console.error(`Shard ${shardId} error:`, err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

// ---- Graceful shutdown -----------------------------------------------------
function shutdown(signal: string): void {
  console.log(`\n${signal} received — disconnecting from Discord...`);
  client.destroy().then(() => {
    console.log('Bye.');
    process.exit(0);
  });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ---- Login -----------------------------------------------------------------
client.login(config.discord.token).catch((err) => {
  console.error('✗ Failed to login to Discord:', err);
  process.exit(1);
});
