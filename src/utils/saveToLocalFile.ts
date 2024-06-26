import * as fs from 'fs';

export async function saveToLocalFile(
  content: string,
  filename: string
): Promise<void> {
  try {
    fs.writeFileSync(filename, content);
    console.log(`File saved to ${filename}`);
  } catch (error) {
    console.error('Error saving the file:', error);
    throw error;
  }
}
