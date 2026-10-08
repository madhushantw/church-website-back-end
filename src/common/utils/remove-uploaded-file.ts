import { unlink } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

export async function removeUploadedFile(
  fileUrl: string,
  urlPrefix: string,
  uploadDirectory: string,
) {
  if (!fileUrl.startsWith(urlPrefix)) {
    return;
  }

  const filename = fileUrl.slice(urlPrefix.length);

  if (!filename || basename(filename) !== filename) {
    return;
  }

  try {
    await unlink(resolve(uploadDirectory, filename));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}
