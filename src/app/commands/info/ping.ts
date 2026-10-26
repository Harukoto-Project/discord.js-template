import { CommandHandler } from '@/core/CommandHandler.js';
import { ApplicationCommandType, Colors } from 'discord.js';

export default new CommandHandler({
  name: 'ping',
  description: 'Ping the bot',
  type: ApplicationCommandType.ChatInput,
  execute: {
    interaction: async ({ client, interaction }) => {
      await interaction.followUp({
        embeds: [
          {
            title: '🏓 Pong!',
            description: `API Latency: ${client.ws.ping}ms\nClient Latency: ${Date.now() - interaction.createdTimestamp}ms`,
            color: Colors.Aqua,
          },
        ],
      });
    },
  },
});
