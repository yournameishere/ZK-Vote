program registry_zkvote_4521.aleo {
    // Election metadata structure
    struct ElectionMetadata {
        election_id: u64,
        creator: address,
        name_hash: field, // Hash of election name (stored on IPFS)
        description_hash: field, // Hash of description (stored on IPFS)
        ipfs_hash: field, // IPFS hash for full metadata
        created_at: u64,
        eligibility_type: u8, // 0: NFT, 1: Credential, 2: Whitelist
    }

    // Mapping to store election metadata
    mapping election_metadata: u64 => ElectionMetadata;

    // Mapping to track election status
    mapping election_status: u64 => u8; // 0: Active, 1: Closed, 2: Cancelled

    // Mapping to link elections to creators (key is hash of creator + index)
    mapping creator_elections: field => u64;

    // Mapping to count elections per creator
    mapping creator_election_count: address => u64;

    // Counter for unique metadata IDs
    mapping metadata_counter: u8 => u64;

    // Constructor
    @noupgrade
    async constructor() {}

    // Register election metadata
    async transition register_election(
        public election_id: u64,
        public creator: address,
        public name_hash: field,
        public description_hash: field,
        public ipfs_hash: field,
        public eligibility_type: u8
    ) -> Future {
        return register_election_async(election_id, creator, name_hash, description_hash, ipfs_hash, eligibility_type);
    }

    async function register_election_async(
        public election_id: u64,
        public creator: address,
        public name_hash: field,
        public description_hash: field,
        public ipfs_hash: field,
        public eligibility_type: u8
    ) {
        // Get current timestamp (simplified - in real implementation would use block timestamp)
        let created_at = 0u64;
        
        // Create metadata struct
        let metadata: ElectionMetadata = ElectionMetadata {
            election_id: election_id,
            creator: creator,
            name_hash: name_hash,
            description_hash: description_hash,
            ipfs_hash: ipfs_hash,
            created_at: created_at,
            eligibility_type: eligibility_type,
        };
        
        // Store metadata
        Mapping::set(election_metadata, election_id, metadata);
        
        // Set initial status to Active
        Mapping::set(election_status, election_id, 0u8);
        
        // Track creator's elections
        let creator_count = Mapping::get_or_use(creator_election_count, creator, 0u64);
        let creator_key = Poseidon8::hash_to_field([creator as field, creator_count as field]);
        Mapping::set(creator_elections, creator_key, election_id);
        let new_count = creator_count + 1u64;
        Mapping::set(creator_election_count, creator, new_count);
    }

    // Get election metadata
    async transition get_election_metadata(
        public election_id: u64,
        public placeholder_creator: address
    ) -> (ElectionMetadata, Future) {
        let metadata: ElectionMetadata = ElectionMetadata {
            election_id: election_id,
            creator: placeholder_creator,
            name_hash: 0field,
            description_hash: 0field,
            ipfs_hash: 0field,
            created_at: 0u64,
            eligibility_type: 0u8,
        }; // Placeholder
        return (metadata, get_election_metadata_async(election_id));
    }

    async function get_election_metadata_async(
        public election_id: u64
    ) {
        let metadata = Mapping::get(election_metadata, election_id);
        Mapping::set(election_metadata, election_id, metadata); // Store for retrieval
    }

    // Get election status
    async transition get_election_status(
        public election_id: u64
    ) -> (u8, Future) {
        let status: u8 = 0u8; // Placeholder
        return (status, get_election_status_async(election_id));
    }

    async function get_election_status_async(
        public election_id: u64
    ) {
        let status = Mapping::get_or_use(election_status, election_id, 2u8); // Default to Cancelled if not found
        Mapping::set(election_status, election_id, status); // Store for retrieval
    }

    // Update election status
    async transition update_election_status(
        public election_id: u64,
        public new_status: u8,
        public caller: address
    ) -> Future {
        return update_election_status_async(election_id, new_status, caller);
    }

    async function update_election_status_async(
        public election_id: u64,
        public new_status: u8,
        public caller: address
    ) {
        let metadata = Mapping::get(election_metadata, election_id);
        // Only creator can update status
        if (metadata.creator == caller) {
            Mapping::set(election_status, election_id, new_status);
        }
    }

    // Get creator's election by index
    async transition get_creator_election(
        public creator: address,
        public index: u64
    ) -> (u64, Future) {
        let election_id: u64 = 0u64; // Placeholder
        return (election_id, get_creator_election_async(creator, index));
    }

    async function get_creator_election_async(
        public creator: address,
        public index: u64
    ) {
        let creator_key = Poseidon8::hash_to_field([creator as field, index as field]);
        let election_id = Mapping::get_or_use(creator_elections, creator_key, 0u64);
        Mapping::set(creator_elections, creator_key, election_id); // Store for retrieval
    }

    // Get creator's election count
    async transition get_creator_election_count(
        public creator: address
    ) -> (u64, Future) {
        let count: u64 = 0u64; // Placeholder
        return (count, get_creator_count_async(creator));
    }

    async function get_creator_count_async(
        public creator: address
    ) {
        let count = Mapping::get_or_use(creator_election_count, creator, 0u64);
        Mapping::set(creator_election_count, creator, count); // Store for retrieval
    }
}
