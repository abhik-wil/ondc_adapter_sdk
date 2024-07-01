import axios from 'axios';

export async function loadYamlFile(url: string): Promise<string> {
  const fileUrl = new URL(url);
  const response = await axios.get(fileUrl.toString());
  return response.data; // The YAML file content as a string
}
