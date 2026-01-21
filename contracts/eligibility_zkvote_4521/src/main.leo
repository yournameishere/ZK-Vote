program eligibility_zkvote_4521.aleo {
    // Eligibility record structure
    record EligibilityRecord {
        owner: address,
        election_id: u64,
        eligibility_type: u8, // 0: NFT, 1: Credential, 2: Whitelist
        nullifier: field,
    }

    // Mapping to track whitelisted addresses per election (key is hash of election_id + address)
    mapping whitelist: field => bool;

    // Mapping to track NFT collections per election (key is hash of election_id + collection)
    mapping nft_collections: field => bool;

    // Mapping to track credential types per election (key is hash of election_id + credential_hash)
    mapping credential_types: field => bool;

    // Mapping to track issued eligibility records (nullifier => bool)
    mapping issued_records: field => bool;

    // Counter for unique nullifiers
    mapping nullifier_counter: u8 => u64;

    // Constructor
    @noupgrade
    async constructor() {}

    // Add address to whitelist for an election
    async transition add_to_whitelist(
        public election_id: u64,
        public voter_address: address
    ) -> Future {
        return add_to_whitelist_async(election_id, voter_address);
    }

    async function add_to_whitelist_async(
        public election_id: u64,
        public voter_address: address
    ) {
        let key = Poseidon8::hash_to_field([election_id as field, voter_address as field]);
        Mapping::set(whitelist, key, true);
    }

    // Add NFT collection to election eligibility
    async transition add_nft_collection(
        public election_id: u64,
        public collection_address: address
    ) -> Future {
        return add_nft_collection_async(election_id, collection_address);
    }

    async function add_nft_collection_async(
        public election_id: u64,
        public collection_address: address
    ) {
        let key = Poseidon8::hash_to_field([election_id as field, collection_address as field]);
        Mapping::set(nft_collections, key, true);
    }

    // Add credential type to election eligibility
    async transition add_credential_type(
        public election_id: u64,
        public credential_hash: field
    ) -> Future {
        return add_credential_type_async(election_id, credential_hash);
    }

    async function add_credential_type_async(
        public election_id: u64,
        public credential_hash: field
    ) {
        let key = Poseidon8::hash_to_field([election_id as field, credential_hash]);
        Mapping::set(credential_types, key, true);
    }

    // Verify whitelist eligibility and issue record
    async transition verify_whitelist_eligibility(
        public election_id: u64,
        public voter_address: address
    ) -> (EligibilityRecord, Future) {
        // Prepare keys (off-chain computation)
        let whitelist_key = Poseidon8::hash_to_field([election_id as field, voter_address as field]);
        
        // Generate nullifier (off-chain)
        let nullifier = Poseidon8::hash_to_field([election_id as field, voter_address as field, 0u64 as field]);
        
        // Create eligibility record (off-chain)
        let elig_record: EligibilityRecord = EligibilityRecord {
            owner: voter_address,
            election_id: election_id,
            eligibility_type: 2u8, // Whitelist type
            nullifier: nullifier,
        };
        
        return (elig_record, verify_whitelist_async(election_id, voter_address, whitelist_key, nullifier));
    }

    async function verify_whitelist_async(
        public election_id: u64,
        public voter_address: address,
        public whitelist_key: field,
        public nullifier: field
    ) {
        // Check if address is whitelisted
        let is_whitelisted = Mapping::get_or_use(whitelist, whitelist_key, false);
        
        // Get counter
        let counter = Mapping::get_or_use(nullifier_counter, 0u8, 0u64);
        
        // Check if nullifier already used
        let nullifier_used = Mapping::get_or_use(issued_records, nullifier, false);
        
        // Only issue if eligible and nullifier not used
        if (is_whitelisted && !nullifier_used) {
            Mapping::set(issued_records, nullifier, true);
            let new_counter = counter + 1u64;
            Mapping::set(nullifier_counter, 0u8, new_counter);
        }
    }

    // Verify NFT holder eligibility
    async transition verify_nft_eligibility(
        public election_id: u64,
        public voter_address: address,
        public nft_collection: address,
        public nft_id: field
    ) -> (EligibilityRecord, Future) {
        // Prepare keys (off-chain)
        let collection_key = Poseidon8::hash_to_field([election_id as field, nft_collection as field]);
        let nullifier = Poseidon8::hash_to_field([election_id as field, voter_address as field, 0u64 as field]);
        
        // Create eligibility record (off-chain)
        let elig_record: EligibilityRecord = EligibilityRecord {
            owner: voter_address,
            election_id: election_id,
            eligibility_type: 0u8, // NFT type
            nullifier: nullifier,
        };
        
        return (elig_record, verify_nft_async(election_id, voter_address, collection_key, nullifier));
    }

    async function verify_nft_async(
        public election_id: u64,
        public voter_address: address,
        public collection_key: field,
        public nullifier: field
    ) {
        // Check if collection is eligible
        let collection_eligible = Mapping::get_or_use(nft_collections, collection_key, false);
        
        // Get counter
        let counter = Mapping::get_or_use(nullifier_counter, 0u8, 0u64);
        
        // Check if nullifier already used
        let nullifier_used = Mapping::get_or_use(issued_records, nullifier, false);
        
        // Only issue if eligible and nullifier not used
        if (collection_eligible && !nullifier_used) {
            Mapping::set(issued_records, nullifier, true);
            let new_counter = counter + 1u64;
            Mapping::set(nullifier_counter, 0u8, new_counter);
        }
    }

    // Verify credential holder eligibility
    async transition verify_credential_eligibility(
        public election_id: u64,
        public voter_address: address,
        public credential_hash: field
    ) -> (EligibilityRecord, Future) {
        // Prepare keys (off-chain)
        let credential_key = Poseidon8::hash_to_field([election_id as field, credential_hash]);
        let nullifier = Poseidon8::hash_to_field([election_id as field, voter_address as field, 0u64 as field]);
        
        // Create eligibility record (off-chain)
        let elig_record: EligibilityRecord = EligibilityRecord {
            owner: voter_address,
            election_id: election_id,
            eligibility_type: 1u8, // Credential type
            nullifier: nullifier,
        };
        
        return (elig_record, verify_credential_async(election_id, voter_address, credential_key, nullifier));
    }

    async function verify_credential_async(
        public election_id: u64,
        public voter_address: address,
        public credential_key: field,
        public nullifier: field
    ) {
        // Check if credential type is eligible
        let credential_eligible = Mapping::get_or_use(credential_types, credential_key, false);
        
        // Get counter
        let counter = Mapping::get_or_use(nullifier_counter, 0u8, 0u64);
        
        // Check if nullifier already used
        let nullifier_used = Mapping::get_or_use(issued_records, nullifier, false);
        
        // Only issue if eligible and nullifier not used
        if (credential_eligible && !nullifier_used) {
            Mapping::set(issued_records, nullifier, true);
            let new_counter = counter + 1u64;
            Mapping::set(nullifier_counter, 0u8, new_counter);
        }
    }

    // Check if eligibility record is valid
    async transition check_eligibility_valid(
        public nullifier: field
    ) -> (bool, Future) {
        let is_valid: bool = false; // Placeholder
        return (is_valid, check_eligibility_valid_async(nullifier));
    }

    async function check_eligibility_valid_async(
        public nullifier: field
    ) {
        let is_valid = Mapping::get_or_use(issued_records, nullifier, false);
        // Store result for retrieval
        Mapping::set(issued_records, nullifier, is_valid);
    }
}
