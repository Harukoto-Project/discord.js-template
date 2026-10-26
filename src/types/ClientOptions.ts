import { type ClientOptions as DiscordClientOptions } from 'discord.js';

export type ClientOptions = Partial<DiscordClientOptions> & {
  devMode?: boolean;
  admins?: string[];
};
