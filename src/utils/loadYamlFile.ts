import axios from 'axios';

export async function loadYamlFile(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    return response.data; // The YAML file content as a string
  } catch (error) {
    console.error('Error fetching the YAML file:', error);
    throw error;
  }
}
