program voting_zkvote_4522.aleo {
    // Vote record structure
    record VoteRecord {
        owner: address,
        election_id: u64,
        option_index: u8,
        nullifier: field,
        timestamp: u64,
    }

    // Election structure
    struct Election {
        creator: address,
        start_time: u64,
        end_time: u64,
        option_count: u8,
        status: u8, // 0: Active, 1: Closed, 2: Cancelled
    }

    // Mapping to store elections
    mapping elections: u64 => Election;

    // Mapping to track vote counts per option per election (key is hash of election_id + option_index)
    mapping vote_counts: field => u64;

    // Mapping to track used nullifiers (prevents double voting)
    mapping used_nullifiers: field => bool;

    // Mapping to track total votes per election
    mapping total_votes: u64 => u64;

    // Counter for unique election IDs
    mapping election_counter: u8 => u64;

    // Constructor
    @noupgrade
    async constructor() {}

    // Create a new election
    async transition create_election(
        public creator: address,
        public start_time: u64,
        public end_time: u64,
        public option_count: u8
    ) -> (u64, Future) {
        // Calculate election ID off-chain (will be verified on-chain)
        let election_id: u64 = 1u64; // Placeholder, actual ID set on-chain
        
        return (election_id, create_election_async(creator, start_time, end_time, option_count));
    }

    async function create_election_async(
        public creator: address,
        public start_time: u64,
        public end_time: u64,
        public option_count: u8
    ) {
        // Get current counter and increment
        let current_counter = Mapping::get_or_use(election_counter, 0u8, 0u64);
        let election_id: u64 = current_counter + 1u64;
        
        // Create election struct
        let election: Election = Election {
            creator: creator,
            start_time: start_time,
            end_time: end_time,
            option_count: option_count,
            status: 0u8, // Active
        };
        
        Mapping::set(elections, election_id, election);
        let new_counter = current_counter + 1u64;
        Mapping::set(election_counter, 0u8, new_counter);
        Mapping::set(total_votes, election_id, 0u64);
    }

    // Cast a vote
    async transition cast_vote(
        public election_id: u64,
        public option_index: u8,
        public eligibility_nullifier: field,
        public voter_address: address
    ) -> (VoteRecord, Future) {
        // Generate vote nullifier (off-chain)
        let vote_nullifier = Poseidon8::hash_to_field([election_id as field, eligibility_nullifier, option_index as field]);
        
        // Create vote record (off-chain)
        let vote_record: VoteRecord = VoteRecord {
            owner: voter_address,
            election_id: election_id,
            option_index: option_index,
            nullifier: vote_nullifier,
            timestamp: 0u64,
        };
        
        return (vote_record, cast_vote_async(election_id, option_index, eligibility_nullifier, vote_nullifier, voter_address));
    }

    async function cast_vote_async(
        public election_id: u64,
        public option_index: u8,
        public eligibility_nullifier: field,
        public vote_nullifier: field,
        public voter_address: address
    ) {
        // Get election
        let election = Mapping::get(elections, election_id);
        
        // Check if nullifier already used
        let nullifier_used = Mapping::get_or_use(used_nullifiers, eligibility_nullifier, false);
        
        // Check if vote nullifier already used
        let vote_nullifier_used = Mapping::get_or_use(used_nullifiers, vote_nullifier, false);
        
        // Get vote count key
        let vote_count_key = Poseidon8::hash_to_field([election_id as field, option_index as field]);
        let current_count = Mapping::get_or_use(vote_counts, vote_count_key, 0u64);
        
        // Get total votes for election
        let total = Mapping::get_or_use(total_votes, election_id, 0u64);
        
        // Validate and process vote
        if (!nullifier_used && !vote_nullifier_used && election.status == 0u8) {
            // Mark nullifiers as used
            Mapping::set(used_nullifiers, eligibility_nullifier, true);
            Mapping::set(used_nullifiers, vote_nullifier, true);
            
            // Update vote count for this option
            let new_count = current_count + 1u64;
            Mapping::set(vote_counts, vote_count_key, new_count);
            
            // Update total votes
            let new_total = total + 1u64;
            Mapping::set(total_votes, election_id, new_total);
        }
    }

    // Get vote count for a specific option
    async transition get_vote_count(
        public election_id: u64,
        public option_index: u8
    ) -> (u64, Future) {
        let count: u64 = 0u64; // Placeholder, actual value from async function
        return (count, get_vote_count_async(election_id, option_index));
    }

    async function get_vote_count_async(
        public election_id: u64,
        public option_index: u8
    ) {
        let vote_count_key = Poseidon8::hash_to_field([election_id as field, option_index as field]);
        let count = Mapping::get_or_use(vote_counts, vote_count_key, 0u64);
        Mapping::set(vote_counts, vote_count_key, count); // Store result for retrieval
    }

    // Get total votes for an election
    async transition get_total_votes(
        public election_id: u64
    ) -> (u64, Future) {
        let total: u64 = 0u64; // Placeholder, actual value from async function
        return (total, get_total_votes_async(election_id));
    }

    async function get_total_votes_async(
        public election_id: u64
    ) {
        let total = Mapping::get_or_use(total_votes, election_id, 0u64);
        Mapping::set(total_votes, election_id, total); // Store result for retrieval
    }

    // Get election details
    async transition get_election(
        public election_id: u64,
        public placeholder_creator: address
    ) -> (Election, Future) {
        let election: Election = Election {
            creator: placeholder_creator,
            start_time: 0u64,
            end_time: 0u64,
            option_count: 0u8,
            status: 0u8,
        }; // Placeholder, actual value from async function
        return (election, get_election_async(election_id));
    }

    async function get_election_async(
        public election_id: u64
    ) {
        let election = Mapping::get(elections, election_id);
        Mapping::set(elections, election_id, election); // Store result for retrieval
    }

    // Close an election (only creator can do this)
    async transition close_election(
        public election_id: u64,
        public caller: address
    ) -> Future {
        return close_election_async(election_id, caller);
    }

    async function close_election_async(
        public election_id: u64,
        public caller: address
    ) {
        let election = Mapping::get(elections, election_id);
        if (election.creator == caller) {
            let closed_election: Election = Election {
                creator: election.creator,
                start_time: election.start_time,
                end_time: election.end_time,
                option_count: election.option_count,
                status: 1u8, // Closed
            };
            Mapping::set(elections, election_id, closed_election);
        }
    }
}
