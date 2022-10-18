import { createClient, Client } from "urql";

export async function initUrql(apiUrl: string): Promise<Client> {
  return new Promise((resolve, reject) => {
    const client = createClient({
      url: apiUrl,
    });
    if (!client) {
      reject(Error("Failed to init initUrqlClient."));
    } else {
      resolve(client);
    }
  });
}
