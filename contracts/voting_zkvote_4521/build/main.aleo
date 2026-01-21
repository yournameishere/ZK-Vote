program voting_zkvote_4521.aleo;

record VoteRecord:
    owner as address.private;
    election_id as u64.private;
    option_index as u8.private;
    nullifier as field.private;
    timestamp as u64.private;

struct Election:
    creator as address;
    start_time as u64;
    end_time as u64;
    option_count as u8;
    status as u8;

mapping elections:
    key as u64.public;
    value as Election.public;

mapping vote_counts:
    key as field.public;
    value as u64.public;

mapping used_nullifiers:
    key as field.public;
    value as boolean.public;

mapping total_votes:
    key as u64.public;
    value as u64.public;

mapping election_counter:
    key as u8.public;
    value as u64.public;

function create_election:
    input r0 as address.public;
    input r1 as u64.public;
    input r2 as u64.public;
    input r3 as u8.public;
    async create_election r0 r1 r2 r3 into r4;
    output 1u64 as u64.private;
    output r4 as voting_zkvote_4521.aleo/create_election.future;

finalize create_election:
    input r0 as address.public;
    input r1 as u64.public;
    input r2 as u64.public;
    input r3 as u8.public;
    get.or_use election_counter[0u8] 0u64 into r4;
    add r4 1u64 into r5;
    cast r0 r1 r2 r3 0u8 into r6 as Election;
    set r6 into elections[r5];
    set r5 into election_counter[0u8];
    set 0u64 into total_votes[r5];

function cast_vote:
    input r0 as u64.public;
    input r1 as u8.public;
    input r2 as field.public;
    input r3 as address.public;
    cast r0 into r4 as field;
    cast r1 into r5 as field;
    cast r4 r2 r5 into r6 as [field; 3u32];
    hash.psd8 r6 into r7 as field;
    cast r3 r0 r1 r7 0u64 into r8 as VoteRecord.record;
    async cast_vote r0 r1 r2 r7 r3 into r9;
    output r8 as VoteRecord.record;
    output r9 as voting_zkvote_4521.aleo/cast_vote.future;

finalize cast_vote:
    input r0 as u64.public;
    input r1 as u8.public;
    input r2 as field.public;
    input r3 as field.public;
    input r4 as address.public;
    get elections[r0] into r5;
    get.or_use used_nullifiers[r2] false into r6;
    get.or_use used_nullifiers[r3] false into r7;
    cast r0 into r8 as field;
    cast r1 into r9 as field;
    cast r8 r9 into r10 as [field; 2u32];
    hash.psd8 r10 into r11 as field;
    get.or_use vote_counts[r11] 0u64 into r12;
    get.or_use total_votes[r0] 0u64 into r13;
    not r6 into r14;
    not r7 into r15;
    and r14 r15 into r16;
    is.eq r5.status 0u8 into r17;
    and r16 r17 into r18;
    branch.eq r18 false to end_then_0_0;
    set true into used_nullifiers[r2];
    set true into used_nullifiers[r3];
    add r12 1u64 into r19;
    set r19 into vote_counts[r11];
    add r13 1u64 into r20;
    set r20 into total_votes[r0];
    branch.eq true true to end_otherwise_0_1;
    position end_then_0_0;
    position end_otherwise_0_1;

function get_vote_count:
    input r0 as u64.public;
    input r1 as u8.public;
    async get_vote_count r0 r1 into r2;
    output 0u64 as u64.private;
    output r2 as voting_zkvote_4521.aleo/get_vote_count.future;

finalize get_vote_count:
    input r0 as u64.public;
    input r1 as u8.public;
    cast r0 into r2 as field;
    cast r1 into r3 as field;
    cast r2 r3 into r4 as [field; 2u32];
    hash.psd8 r4 into r5 as field;
    get.or_use vote_counts[r5] 0u64 into r6;
    set r6 into vote_counts[r5];

function get_total_votes:
    input r0 as u64.public;
    async get_total_votes r0 into r1;
    output 0u64 as u64.private;
    output r1 as voting_zkvote_4521.aleo/get_total_votes.future;

finalize get_total_votes:
    input r0 as u64.public;
    get.or_use total_votes[r0] 0u64 into r1;
    set r1 into total_votes[r0];

function get_election:
    input r0 as u64.public;
    input r1 as address.public;
    cast r1 0u64 0u64 0u8 0u8 into r2 as Election;
    async get_election r0 into r3;
    output r2 as Election.private;
    output r3 as voting_zkvote_4521.aleo/get_election.future;

finalize get_election:
    input r0 as u64.public;
    get elections[r0] into r1;
    set r1 into elections[r0];

function close_election:
    input r0 as u64.public;
    input r1 as address.public;
    async close_election r0 r1 into r2;
    output r2 as voting_zkvote_4521.aleo/close_election.future;

finalize close_election:
    input r0 as u64.public;
    input r1 as address.public;
    get elections[r0] into r2;
    is.eq r2.creator r1 into r3;
    branch.eq r3 false to end_then_0_2;
    cast r2.creator r2.start_time r2.end_time r2.option_count 1u8 into r4 as Election;
    set r4 into elections[r0];
    branch.eq true true to end_otherwise_0_3;
    position end_then_0_2;
    position end_otherwise_0_3;

constructor:
    assert.eq edition 0u16;
