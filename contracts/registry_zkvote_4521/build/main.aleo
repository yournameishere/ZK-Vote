program registry_zkvote_4521.aleo;

struct ElectionMetadata:
    election_id as u64;
    creator as address;
    name_hash as field;
    description_hash as field;
    ipfs_hash as field;
    created_at as u64;
    eligibility_type as u8;

mapping election_metadata:
    key as u64.public;
    value as ElectionMetadata.public;

mapping election_status:
    key as u64.public;
    value as u8.public;

mapping creator_elections:
    key as field.public;
    value as u64.public;

mapping creator_election_count:
    key as address.public;
    value as u64.public;

mapping metadata_counter:
    key as u8.public;
    value as u64.public;

function register_election:
    input r0 as u64.public;
    input r1 as address.public;
    input r2 as field.public;
    input r3 as field.public;
    input r4 as field.public;
    input r5 as u8.public;
    async register_election r0 r1 r2 r3 r4 r5 into r6;
    output r6 as registry_zkvote_4521.aleo/register_election.future;

finalize register_election:
    input r0 as u64.public;
    input r1 as address.public;
    input r2 as field.public;
    input r3 as field.public;
    input r4 as field.public;
    input r5 as u8.public;
    cast r0 r1 r2 r3 r4 0u64 r5 into r6 as ElectionMetadata;
    set r6 into election_metadata[r0];
    set 0u8 into election_status[r0];
    get.or_use creator_election_count[r1] 0u64 into r7;
    cast r1 into r8 as field;
    cast r7 into r9 as field;
    cast r8 r9 into r10 as [field; 2u32];
    hash.psd8 r10 into r11 as field;
    set r0 into creator_elections[r11];
    add r7 1u64 into r12;
    set r12 into creator_election_count[r1];

function get_election_metadata:
    input r0 as u64.public;
    input r1 as address.public;
    cast r0 r1 0field 0field 0field 0u64 0u8 into r2 as ElectionMetadata;
    async get_election_metadata r0 into r3;
    output r2 as ElectionMetadata.private;
    output r3 as registry_zkvote_4521.aleo/get_election_metadata.future;

finalize get_election_metadata:
    input r0 as u64.public;
    get election_metadata[r0] into r1;
    set r1 into election_metadata[r0];

function get_election_status:
    input r0 as u64.public;
    async get_election_status r0 into r1;
    output 0u8 as u8.private;
    output r1 as registry_zkvote_4521.aleo/get_election_status.future;

finalize get_election_status:
    input r0 as u64.public;
    get.or_use election_status[r0] 2u8 into r1;
    set r1 into election_status[r0];

function update_election_status:
    input r0 as u64.public;
    input r1 as u8.public;
    input r2 as address.public;
    async update_election_status r0 r1 r2 into r3;
    output r3 as registry_zkvote_4521.aleo/update_election_status.future;

finalize update_election_status:
    input r0 as u64.public;
    input r1 as u8.public;
    input r2 as address.public;
    get election_metadata[r0] into r3;
    is.eq r3.creator r2 into r4;
    branch.eq r4 false to end_then_0_0;
    set r1 into election_status[r0];
    branch.eq true true to end_otherwise_0_1;
    position end_then_0_0;
    position end_otherwise_0_1;

function get_creator_election:
    input r0 as address.public;
    input r1 as u64.public;
    async get_creator_election r0 r1 into r2;
    output 0u64 as u64.private;
    output r2 as registry_zkvote_4521.aleo/get_creator_election.future;

finalize get_creator_election:
    input r0 as address.public;
    input r1 as u64.public;
    cast r0 into r2 as field;
    cast r1 into r3 as field;
    cast r2 r3 into r4 as [field; 2u32];
    hash.psd8 r4 into r5 as field;
    get.or_use creator_elections[r5] 0u64 into r6;
    set r6 into creator_elections[r5];

function get_creator_election_count:
    input r0 as address.public;
    async get_creator_election_count r0 into r1;
    output 0u64 as u64.private;
    output r1 as registry_zkvote_4521.aleo/get_creator_election_count.future;

finalize get_creator_election_count:
    input r0 as address.public;
    get.or_use creator_election_count[r0] 0u64 into r1;
    set r1 into creator_election_count[r0];

constructor:
    assert.eq edition 0u16;
