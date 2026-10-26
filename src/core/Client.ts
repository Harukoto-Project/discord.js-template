import type { CommandOptions } from '@/types/CommandOptions.js';
import {
  Client as DiscordClient,
  GatewayIntentBits,
  ApplicationCommandType,
  type ClientEvents,
  Collection,
  Events,
} from 'discord.js';
import { logger } from '@/lib/logtape/logtape.js';
import type { EventHandler } from './EventHandler.js';
import type { ClientOptions } from '@/types/ClientOptions.js';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export class Client extends DiscordClient {
  public admins: string[] = [];
  public devMode: boolean = false;

  private __dirname = path.dirname(fileURLToPath(import.meta.url));

  constructor(options?: ClientOptions) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
      ...options,
    });

    this.admins = options?.admins || [];
    this.devMode = options?.devMode || false;
  }

  public commands: Collection<string, CommandOptions> = new Collection();

  private async _importFile<T>(filePath: string): Promise<T> {
    const file = await import(pathToFileURL(filePath).href);
    if (!file) {
      logger.error(`File ${filePath} not found`);
    }

    return file.default;
  }

  private _globJsFiles(relativeDirectory: string) {
    return glob('**/*.js', {
      cwd: path.join(this.__dirname, relativeDirectory),
      absolute: true,
    });
  }

  private async _registerCommands() {
    const commands: CommandOptions[] = [];
    const commandsDirectory = path.join(this.__dirname, '../app/commands');
    const commandFiles = await this._globJsFiles('../app/commands');

    if (commandFiles.length === 0) {
      logger.warn('No command files found in {directory}', {
        directory: commandsDirectory,
      });
    }

    for (const file of commandFiles) {
      const command: CommandOptions = await this._importFile(file);

      switch (command.type ?? ApplicationCommandType.ChatInput) {
        case ApplicationCommandType.ChatInput:
          logger.info('Loaded slash command {commandName}', {
            commandName: command.name,
          });
          break;
        case ApplicationCommandType.Message:
          logger.info('Loaded context menu command {commandName}', {
            commandName: command.name,
          });
          break;
        case ApplicationCommandType.User:
          logger.info('Loaded user context menu command {commandName}', {
            commandName: command.name,
          });
          break;
        case undefined:
          logger.warn('Loaded unknown command {commandName}', {
            commandName: command.name,
          });
          break;
      }

      commands.push(command);
      this.commands.set(command.name, command);
    }

    this.once(Events.ClientReady, () => {
      this.application?.commands
        .set(commands)
        .then(() =>
          logger.info(
            '{commandsLength} slash commands registered in {guildCount} guilds',
            {
              commandsLength: commands.length,
              guildCount: this.guilds.cache.size,
            },
          ),
        )
        .catch((e) => {
          logger.error('Failed to register slash commands', {
            error: e.message,
          });
        });
    });
  }

  private async _registerEvents() {
    const eventFiles = await this._globJsFiles('../app/events');

    for (const filePath of eventFiles) {
      const event =
        await this._importFile<EventHandler<keyof ClientEvents>>(filePath);
      if (event && 'event' in event) {
        this.on(event.event, event.run);
      }
    }
  }

  public async run() {
    await this._registerCommands();
    await this._registerEvents();

    return await super.login(process.env.CLIENT_TOKEN);
  }
}
