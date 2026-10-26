import { I18n } from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const i18n = new I18n({
  locales: ['ja_jp'],
  defaultLocale: 'ja_jp',
  directory: path.join(__dirname, 'locales'),
  extension: '.yml',
});

export const $ = i18n.__;
