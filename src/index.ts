import 'dotenv/config';
import { Client } from './core/Client.js';
import { logger } from './lib/logtape/logtape.js';
import { glob } from 'glob';

export const client = new Client({
  admins:
    process.env.ADMINS?.split(',')
      .map((admin) => admin.trim())
      .filter((admin) => admin !== '') || [],
  devMode: process.env.NODE_ENV === 'development',
});

client.run().then(() => {
  logger.info('Successfully started the bot');
});
