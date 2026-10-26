import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Events,
  MessageContextMenuCommandInteraction,
  MessageFlags,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { client } from '@/index.js';
import { EventHandler } from '@/core/EventHandler.js';
import { errorEmbed } from '@/utils/errorEmbed.js';
import { $ } from '@/lib/i18n.js';

const I18N_PATH = 'core.events.interaction_command.error';

export default new EventHandler(
  Events.InteractionCreate,
  async (interaction) => {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!interaction.guild && interaction.inGuild()) {
        await interaction.deferReply({
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.deferReply({
          flags: command?.ephemeral ? MessageFlags.Ephemeral : undefined,
        });
      }

      if (!command) {
        await interaction.followUp(
          errorEmbed($(`${I18N_PATH}.command_not_found`)),
        );
        return;
      }

      if (!command.execute.interaction) {
        await interaction.followUp(
          errorEmbed($(`${I18N_PATH}.command_not_supported`)),
        );
        return;
      }

      if (command.isAdminOnly && !client.admins.includes(interaction.user.id)) {
        return await interaction.followUp(
          errorEmbed($(`${I18N_PATH}.admin_only`)),
        );
      }

      if (client.devMode && !client.admins.includes(interaction.user.id)) {
        return await interaction.followUp(
          errorEmbed($(`${I18N_PATH}.dev_mode`)),
        );
      }

      if (interaction.guild) {
        const member = interaction.guild?.members.cache.get(
          interaction.user.id,
        );
        if (!member) return;

        if (!member.permissions.has(command.requiredPermissions || [])) {
          return await interaction.followUp(
            errorEmbed($(`${I18N_PATH}.permission_missing`)),
          );
        }
      }

      if (!command.type || command.type === ApplicationCommandType.ChatInput) {
        await command.execute.interaction({
          client,
          interaction: interaction as ChatInputCommandInteraction,
        });
      }

      if (command.type === ApplicationCommandType.Message) {
        await command.execute.interaction({
          client,
          interaction: interaction as MessageContextMenuCommandInteraction,
        });
      }

      if (command.type === ApplicationCommandType.User) {
        await command.execute.interaction({
          client,
          interaction: interaction as UserContextMenuCommandInteraction,
        });
      }
    } else if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (!command || !command.execute.autoComplete) return;

      await command.execute.autoComplete({
        client,
        interaction,
      });
    }
  },
);
