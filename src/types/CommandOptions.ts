import type {
  ApplicationCommandData,
  PermissionResolvable,
  ApplicationCommandType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Message,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

import { Client } from '@/core/Client.js';

type MessageExecuteType = ({
  client,
  message,
  args,
}: {
  client: Client;
  message: Message;
  args: string[];
}) => any;

type AutoCompleteExecuteType = ({
  client,
  interaction,
}: {
  client: Client;
  interaction: AutocompleteInteraction;
}) => any;

type CommandBase = {
  requiredPermissions?: PermissionResolvable[];
  ephemeral?: boolean;
  aliases?: string[];
  isAdminOnly?: boolean;
  canUseUserCommand?: boolean;
};

type Command<
  T extends
    | ApplicationCommandType.ChatInput
    | ApplicationCommandType.Message
    | ApplicationCommandType.User,
> = {
  type: T;
  execute: {
    interaction?: ({
      client,
      interaction,
    }: {
      client: Client;
      interaction: T extends ApplicationCommandType.ChatInput
        ? ChatInputCommandInteraction
        : T extends ApplicationCommandType.Message
          ? MessageContextMenuCommandInteraction
          : UserContextMenuCommandInteraction;
    }) => any;
    message?: MessageExecuteType;
    autoComplete?: AutoCompleteExecuteType;
  };
};

type CommandWithDefault = {
  type?: never;
  execute: {
    interaction?: ({
      client,
      interaction,
    }: {
      client: Client;
      interaction: ChatInputCommandInteraction;
    }) => any;
    message?: MessageExecuteType;
    autoComplete?: AutoCompleteExecuteType;
  };
};

export type CommandOptions = CommandBase &
  ApplicationCommandData &
  (
    | (
        | Command<ApplicationCommandType.ChatInput>
        | Command<ApplicationCommandType.Message>
        | Command<ApplicationCommandType.User>
      )
    | CommandWithDefault
  );
