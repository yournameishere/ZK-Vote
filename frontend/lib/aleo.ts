const RPC_URL = process.env.NEXT_PUBLIC_ALEO_RPC_URL || "https://api.explorer.provable.com/v2";

// Program IDs
export const PROGRAMS = {
  eligibility: process.env.NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID || "eligibility_zkvote_4521.aleo",
  voting: process.env.NEXT_PUBLIC_VOTING_PROGRAM_ID || "voting_zkvote_4522.aleo",
  registry: process.env.NEXT_PUBLIC_REGISTRY_PROGRAM_ID || "registry_zkvote_4521.aleo",
  subscription: process.env.NEXT_PUBLIC_SUBSCRIPTION_PROGRAM_ID || "subscription_zkvote_4522.aleo",
};

// Helper function to get program state
export async function getProgramState(programId: string): Promise<any> {
  try {
    const response = await fetch(`${RPC_URL}/testnet3/program/${programId}`);
    if (!response.ok) {
      throw new Error(`Failed to get program: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error getting program state for ${programId}:`, error);
    throw error;
  }
}

// Helper function to get transaction details
export async function getTransaction(txId: string): Promise<any> {
  try {
    const response = await fetch(`${RPC_URL}/testnet3/transaction/${txId}`);
    if (!response.ok) {
      throw new Error(`Failed to get transaction: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error getting transaction ${txId}:`, error);
    throw error;
  }
}

// Helper function to query program mappings (for reading state)
export async function getMappingValue(
  programId: string,
  mappingName: string,
  key: string
): Promise<any> {
  try {
    // Note: This is a simplified version - actual implementation depends on Aleo RPC API
    // You may need to use a different method based on the actual API
    const response = await fetch(`${RPC_URL}/testnet3/program/${programId}/mapping/${mappingName}/${key}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error getting mapping value:`, error);
    return null;
  }
}
