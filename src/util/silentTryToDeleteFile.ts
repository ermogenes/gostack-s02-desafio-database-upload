import fs from 'fs';

export default async function silentTryToDeleteFile(
  fullPathAndFilename: string,
): Promise<void> {
  try {
    fs.promises.unlink(fullPathAndFilename);
  } catch {
    // do not trigger error if not succedded
  }
}
