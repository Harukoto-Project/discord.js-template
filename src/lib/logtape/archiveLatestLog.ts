import dayjs from 'dayjs';
import { existsSync, mkdirSync, renameSync, statSync } from 'fs';
import path from 'path';

const LATEST_LOG_FILE_NAME = 'latest.log';

export function archiveLatestLog(logsDirectory: string): string {
  mkdirSync(logsDirectory, { recursive: true });

  const latestLogPath = path.join(logsDirectory, LATEST_LOG_FILE_NAME);
  if (!existsSync(latestLogPath)) {
    return latestLogPath;
  }

  const stats = statSync(latestLogPath);
  if (stats.size === 0) {
    return latestLogPath;
  }

  renameSync(
    latestLogPath,
    path.join(logsDirectory, createArchiveFileName(logsDirectory, stats.mtime)),
  );
  return latestLogPath;
}

function createArchiveFileName(
  logsDirectory: string,
  modifiedAt: Date,
): string {
  const baseName = dayjs(modifiedAt).format('YYYY-MM-DD_HH-mm-ss');
  let fileName = `${baseName}.log`;
  let suffix = 2;

  while (existsSync(path.join(logsDirectory, fileName))) {
    fileName = `${baseName}-${suffix}.log`;
    suffix += 1;
  }

  return fileName;
}
