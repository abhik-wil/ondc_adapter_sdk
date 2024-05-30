import * as fs from 'fs';

export async function saveToLocalFile(
  content: string,
  filename: string
): Promise<void> {
  try {
    await fs.promises.writeFile(filename, content);
    console.log(`File saved to ${filename}`);
  } catch (error) {
    console.error('Error saving the file:', error);
    throw error;
  }
}
