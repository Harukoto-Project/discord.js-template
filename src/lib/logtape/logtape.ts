import { getStreamFileSink } from '@logtape/file';
import { configure, getConsoleSink, getLogger } from '@logtape/logtape';
import path from 'path';
import { archiveLatestLog } from './archiveLatestLog.js';

const LOGS_DIRECTORY = path.join(process.cwd(), 'logs');
const LOG_FILE_PATH = archiveLatestLog(LOGS_DIRECTORY);

await configure<'console' | 'file', string>({
  sinks: {
    console: getConsoleSink(),
    file: getStreamFileSink(LOG_FILE_PATH, {
      highWaterMark: 32768,
    }),
  },
  loggers: [
    {
      category: 'BOT',
      lowestLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      sinks: ['console', 'file'],
    },
    {
      category: ['logtape', 'meta'],
      lowestLevel: 'warning',
      sinks: ['console'],
    },
  ],
});

export const logger = getLogger('BOT');
