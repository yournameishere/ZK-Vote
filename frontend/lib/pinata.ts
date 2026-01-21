import axios from "axios";

// Support both NEXT_PUBLIC_PINATA_JWT and PINATA_JWT for compatibility
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || (typeof window !== "undefined" ? "" : process.env.PINATA_JWT || "");
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "gateway.pinata.cloud";

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

// Upload JSON to IPFS via Pinata
export async function uploadToPinata(data: any): Promise<string> {
  try {
    if (!PINATA_JWT) {
      // If Pinata not configured, use local storage fallback
      console.warn("Pinata JWT not configured. Using local storage fallback.");
      const hash = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      if (typeof window !== "undefined") {
        localStorage.setItem(`ipfs_${hash}`, JSON.stringify(data));
      }
      return hash;
    }

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataContent: data,
        pinataMetadata: {
          name: `zkvote-election-${Date.now()}`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error: any) {
    console.error("Pinata upload error:", error);
    // Fallback to local storage
    const hash = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    if (typeof window !== "undefined") {
      localStorage.setItem(`ipfs_${hash}`, JSON.stringify(data));
    }
    return hash;
  }
}

// Fetch JSON from IPFS
export async function fetchFromPinata(ipfsHash: string): Promise<any> {
  try {
    // Check if it's a local storage hash
    if (ipfsHash.startsWith("local_")) {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`ipfs_${ipfsHash}`);
        if (stored) {
          return JSON.parse(stored);
        }
      }
      throw new Error("Local hash not found");
    }

    // Try Pinata gateway first
    try {
      const gatewayBase = GATEWAY_URL.startsWith("http") ? GATEWAY_URL : `https://${GATEWAY_URL}`;
      const response = await axios.get(`${gatewayBase}/ipfs/${ipfsHash}`);
      return response.data;
    } catch (pinataError) {
      // Fallback to public IPFS gateway
      const response = await axios.get(`https://ipfs.io/ipfs/${ipfsHash}`);
      return response.data;
    }
  } catch (error) {
    console.error("IPFS fetch error:", error);
    throw error;
  }
}
