program subscription_zkvote_4521.aleo;

struct Subscription:
    user as address;
    tier as u8;
    start_time as u64;
    end_time as u64;
    active as boolean;

mapping subscriptions:
    key as address.public;
    value as Subscription.public;

mapping feature_access:
    key as field.public;
    value as boolean.public;

function subscribe_premium:
    input r0 as address.public;
    input r1 as u64.public;
    async subscribe_premium r0 r1 into r2;
    output r2 as subscription_zkvote_4521.aleo/subscribe_premium.future;

finalize subscribe_premium:
    input r0 as address.public;
    input r1 as u64.public;
    cast r0 0u8 0u64 0u64 false into r2 as Subscription;
    get.or_use subscriptions[r0] r2 into r3;
    mul r1 86400u64 into r4;
    add 0u64 r4 into r5;
    cast r0 1u8 0u64 r5 true into r6 as Subscription;
    set r6 into subscriptions[r0];
    cast r0 into r7 as field;
    cast r7 0field into r8 as [field; 2u32];
    hash.psd8 r8 into r9 as field;
    cast r0 into r10 as field;
    cast r10 1field into r11 as [field; 2u32];
    hash.psd8 r11 into r12 as field;
    cast r0 into r13 as field;
    cast r13 2field into r14 as [field; 2u32];
    hash.psd8 r14 into r15 as field;
    set true into feature_access[r9];
    set true into feature_access[r12];
    set true into feature_access[r15];

function cancel_subscription:
    input r0 as address.public;
    async cancel_subscription r0 into r1;
    output r1 as subscription_zkvote_4521.aleo/cancel_subscription.future;

finalize cancel_subscription:
    input r0 as address.public;
    get subscriptions[r0] into r1;
    is.eq r1.user r0 into r2;
    branch.eq r2 false to end_then_0_0;
    cast r0 0u8 r1.start_time r1.end_time false into r3 as Subscription;
    set r3 into subscriptions[r0];
    cast r0 into r4 as field;
    cast r4 0field into r5 as [field; 2u32];
    hash.psd8 r5 into r6 as field;
    cast r0 into r7 as field;
    cast r7 1field into r8 as [field; 2u32];
    hash.psd8 r8 into r9 as field;
    cast r0 into r10 as field;
    cast r10 2field into r11 as [field; 2u32];
    hash.psd8 r11 into r12 as field;
    set false into feature_access[r6];
    set false into feature_access[r9];
    set false into feature_access[r12];
    branch.eq true true to end_otherwise_0_1;
    position end_then_0_0;
    position end_otherwise_0_1;

function get_subscription:
    input r0 as address.public;
    cast r0 0u8 0u64 0u64 false into r1 as Subscription;
    async get_subscription r0 into r2;
    output r1 as Subscription.private;
    output r2 as subscription_zkvote_4521.aleo/get_subscription.future;

finalize get_subscription:
    input r0 as address.public;
    cast r0 0u8 0u64 0u64 false into r1 as Subscription;
    get.or_use subscriptions[r0] r1 into r2;
    set r2 into subscriptions[r0];

function check_feature_access:
    input r0 as address.public;
    input r1 as u8.public;
    async check_feature_access r0 r1 into r2;
    output false as boolean.private;
    output r2 as subscription_zkvote_4521.aleo/check_feature_access.future;

finalize check_feature_access:
    input r0 as address.public;
    input r1 as u8.public;
    cast r0 into r2 as field;
    cast r1 into r3 as field;
    cast r2 r3 into r4 as [field; 2u32];
    hash.psd8 r4 into r5 as field;
    get.or_use feature_access[r5] false into r6;
    cast r0 0u8 0u64 0u64 false into r7 as Subscription;
    get.or_use subscriptions[r0] r7 into r8;
    and r6 r8.active into r9;
    set r9 into feature_access[r5];

function is_premium:
    input r0 as address.public;
    async is_premium r0 into r1;
    output false as boolean.private;
    output r1 as subscription_zkvote_4521.aleo/is_premium.future;

finalize is_premium:
    input r0 as address.public;
    cast r0 0u8 0u64 0u64 false into r1 as Subscription;
    get.or_use subscriptions[r0] r1 into r2;
    is.eq r2.tier 1u8 into r3;
    and r3 r2.active into r4;
    branch.eq r4 false to end_then_0_2;
    set r2 into subscriptions[r0];
    branch.eq true true to end_otherwise_0_3;
    position end_then_0_2;
    position end_otherwise_0_3;

constructor:
    assert.eq edition 0u16;
