import type { CommandOptions } from '@/types/CommandOptions.js';

export class CommandHandler {
  constructor(commandOptions: CommandOptions) {
    Object.assign(this, commandOptions);
  }
}
