import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check that Constellation is alive and reachable');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const roundtrip = Date.now() - interaction.createdTimestamp;
  const wsPing = interaction.client.ws.ping;

  await interaction.reply({
    content: `🏓 Pong!\n\u00A0\u00A0Roundtrip: ${roundtrip}ms\n\u00A0\u00A0Gateway: ${wsPing}ms`,
    flags: MessageFlags.Ephemeral,
  });
}
