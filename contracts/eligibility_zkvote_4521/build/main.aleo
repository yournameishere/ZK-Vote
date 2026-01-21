program eligibility_zkvote_4521.aleo;

record EligibilityRecord:
    owner as address.private;
    election_id as u64.private;
    eligibility_type as u8.private;
    nullifier as field.private;

mapping whitelist:
    key as field.public;
    value as boolean.public;

mapping nft_collections:
    key as field.public;
    value as boolean.public;

mapping credential_types:
    key as field.public;
    value as boolean.public;

mapping issued_records:
    key as field.public;
    value as boolean.public;

mapping nullifier_counter:
    key as u8.public;
    value as u64.public;

function add_to_whitelist:
    input r0 as u64.public;
    input r1 as address.public;
    async add_to_whitelist r0 r1 into r2;
    output r2 as eligibility_zkvote_4521.aleo/add_to_whitelist.future;

finalize add_to_whitelist:
    input r0 as u64.public;
    input r1 as address.public;
    cast r0 into r2 as field;
    cast r1 into r3 as field;
    cast r2 r3 into r4 as [field; 2u32];
    hash.psd8 r4 into r5 as field;
    set true into whitelist[r5];

function add_nft_collection:
    input r0 as u64.public;
    input r1 as address.public;
    async add_nft_collection r0 r1 into r2;
    output r2 as eligibility_zkvote_4521.aleo/add_nft_collection.future;

finalize add_nft_collection:
    input r0 as u64.public;
    input r1 as address.public;
    cast r0 into r2 as field;
    cast r1 into r3 as field;
    cast r2 r3 into r4 as [field; 2u32];
    hash.psd8 r4 into r5 as field;
    set true into nft_collections[r5];

function add_credential_type:
    input r0 as u64.public;
    input r1 as field.public;
    async add_credential_type r0 r1 into r2;
    output r2 as eligibility_zkvote_4521.aleo/add_credential_type.future;

finalize add_credential_type:
    input r0 as u64.public;
    input r1 as field.public;
    cast r0 into r2 as field;
    cast r2 r1 into r3 as [field; 2u32];
    hash.psd8 r3 into r4 as field;
    set true into credential_types[r4];

function verify_whitelist_eligibility:
    input r0 as u64.public;
    input r1 as address.public;
    cast r0 into r2 as field;
    cast r1 into r3 as field;
    cast r2 r3 into r4 as [field; 2u32];
    hash.psd8 r4 into r5 as field;
    cast r0 into r6 as field;
    cast r1 into r7 as field;
    cast r6 r7 0field into r8 as [field; 3u32];
    hash.psd8 r8 into r9 as field;
    cast r1 r0 2u8 r9 into r10 as EligibilityRecord.record;
    async verify_whitelist_eligibility r0 r1 r5 r9 into r11;
    output r10 as EligibilityRecord.record;
    output r11 as eligibility_zkvote_4521.aleo/verify_whitelist_eligibility.future;

finalize verify_whitelist_eligibility:
    input r0 as u64.public;
    input r1 as address.public;
    input r2 as field.public;
    input r3 as field.public;
    get.or_use whitelist[r2] false into r4;
    get.or_use nullifier_counter[0u8] 0u64 into r5;
    get.or_use issued_records[r3] false into r6;
    not r6 into r7;
    and r4 r7 into r8;
    branch.eq r8 false to end_then_0_0;
    set true into issued_records[r3];
    add r5 1u64 into r9;
    set r9 into nullifier_counter[0u8];
    branch.eq true true to end_otherwise_0_1;
    position end_then_0_0;
    position end_otherwise_0_1;

function verify_nft_eligibility:
    input r0 as u64.public;
    input r1 as address.public;
    input r2 as address.public;
    input r3 as field.public;
    cast r0 into r4 as field;
    cast r2 into r5 as field;
    cast r4 r5 into r6 as [field; 2u32];
    hash.psd8 r6 into r7 as field;
    cast r0 into r8 as field;
    cast r1 into r9 as field;
    cast r8 r9 0field into r10 as [field; 3u32];
    hash.psd8 r10 into r11 as field;
    cast r1 r0 0u8 r11 into r12 as EligibilityRecord.record;
    async verify_nft_eligibility r0 r1 r7 r11 into r13;
    output r12 as EligibilityRecord.record;
    output r13 as eligibility_zkvote_4521.aleo/verify_nft_eligibility.future;

finalize verify_nft_eligibility:
    input r0 as u64.public;
    input r1 as address.public;
    input r2 as field.public;
    input r3 as field.public;
    get.or_use nft_collections[r2] false into r4;
    get.or_use nullifier_counter[0u8] 0u64 into r5;
    get.or_use issued_records[r3] false into r6;
    not r6 into r7;
    and r4 r7 into r8;
    branch.eq r8 false to end_then_0_2;
    set true into issued_records[r3];
    add r5 1u64 into r9;
    set r9 into nullifier_counter[0u8];
    branch.eq true true to end_otherwise_0_3;
    position end_then_0_2;
    position end_otherwise_0_3;

function verify_credential_eligibility:
    input r0 as u64.public;
    input r1 as address.public;
    input r2 as field.public;
    cast r0 into r3 as field;
    cast r3 r2 into r4 as [field; 2u32];
    hash.psd8 r4 into r5 as field;
    cast r0 into r6 as field;
    cast r1 into r7 as field;
    cast r6 r7 0field into r8 as [field; 3u32];
    hash.psd8 r8 into r9 as field;
    cast r1 r0 1u8 r9 into r10 as EligibilityRecord.record;
    async verify_credential_eligibility r0 r1 r5 r9 into r11;
    output r10 as EligibilityRecord.record;
    output r11 as eligibility_zkvote_4521.aleo/verify_credential_eligibility.future;

finalize verify_credential_eligibility:
    input r0 as u64.public;
    input r1 as address.public;
    input r2 as field.public;
    input r3 as field.public;
    get.or_use credential_types[r2] false into r4;
    get.or_use nullifier_counter[0u8] 0u64 into r5;
    get.or_use issued_records[r3] false into r6;
    not r6 into r7;
    and r4 r7 into r8;
    branch.eq r8 false to end_then_0_4;
    set true into issued_records[r3];
    add r5 1u64 into r9;
    set r9 into nullifier_counter[0u8];
    branch.eq true true to end_otherwise_0_5;
    position end_then_0_4;
    position end_otherwise_0_5;

function check_eligibility_valid:
    input r0 as field.public;
    async check_eligibility_valid r0 into r1;
    output false as boolean.private;
    output r1 as eligibility_zkvote_4521.aleo/check_eligibility_valid.future;

finalize check_eligibility_valid:
    input r0 as field.public;
    get.or_use issued_records[r0] false into r1;
    set r1 into issued_records[r0];

constructor:
    assert.eq edition 0u16;
