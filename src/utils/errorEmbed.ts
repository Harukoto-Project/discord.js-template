import { Colors, type BaseMessageOptions } from 'discord.js';

export function errorEmbed(message: string): BaseMessageOptions {
  return {
    embeds: [
      {
        title: 'エラーが発生しました',
        description: message,
        color: Colors.Red,
      },
    ],
  };
}
