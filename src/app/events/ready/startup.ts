import { EventHandler } from '@/core/EventHandler.js';
import { client } from '@/index.js';
import { logger } from '@/lib/logtape/logtape.js';
import { ActivityType, Events } from 'discord.js';

export default new EventHandler(Events.ClientReady, async () => {
  if (!client.user) {
    return logger.error('Client user not found');
  }

  logger.info('Logged in to {clientName}', { clientName: client.user?.tag });

  if (client.devMode) {
    logger.debug('Development mode is enabled');

    client.user.setPresence({
      activities: [
        {
          name: '開発モードが有効です',
          type: ActivityType.Listening,
        },
      ],
      status: 'dnd',
    });
  } else {
    client.user.setPresence({
      status: 'online',
    });
  }
});
