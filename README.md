# ZK-Vote - Privacy-Focused Voting Platform on Aleo

**Vote anonymously. Prove eligibility. Verify results. Reveal nothing else.**

ZK-Vote is a production-ready, privacy-first voting platform built on Aleo blockchain. It leverages zero-knowledge proofs to enable anonymous voting while ensuring only eligible users can participate. All votes are encrypted, stored on-chain, and publicly verifiable without compromising voter privacy.

## 🌟 What is ZK-Vote?

ZK-Vote solves the fundamental privacy problem in digital voting systems. Traditional voting platforms expose voter identities and choices, creating risks of coercion, vote buying, and retaliation. ZK-Vote uses Aleo's zero-knowledge cryptography to ensure:

- **Complete Anonymity**: No one can see who voted for what
- **Eligibility Verification**: Only authorized users can vote (verified via ZK proofs)
- **Public Verifiability**: Anyone can verify that votes were counted correctly
- **Double-Vote Prevention**: Cryptographic nullifiers prevent duplicate voting
- **On-Chain Storage**: All votes are permanently stored on Aleo blockchain



live url : https://zk-vote-omega.vercel.app/

## 🎯 Use Cases

ZK-Vote is perfect for:

- **College/University Elections**: Student council, class representatives, club leadership
- **DAO Governance**: Private voting on proposals without revealing member positions
- **Corporate Voting**: Board decisions, employee surveys, internal polls
- **Community Polls**: Neighborhood decisions, community center votes
- **Private Surveys**: Sensitive research, anonymous feedback collection
- **Whistleblower Systems**: Safe reporting with cryptographic protection

## 🚀 Key Features

### Privacy & Security
- ✅ **Zero-Knowledge Proofs**: Verify eligibility without revealing identity
- ✅ **Encrypted Votes**: All votes are encrypted before being stored on-chain
- ✅ **Nullifier System**: Prevents double voting while maintaining anonymity
- ✅ **On-Chain Storage**: Permanent, tamper-proof vote records

### Eligibility Types
- ✅ **Whitelist**: Pre-approved wallet addresses
- ✅ **NFT Holders**: Users holding specific NFT collections
- ✅ **Credential Holders**: Users with verified credentials

### User Experience
- ✅ **Modern UI**: Beautiful, responsive design with light blue/white theme
- ✅ **Wallet Integration**: Seamless Puzzle Wallet connection
- ✅ **Real-Time Updates**: Live vote counts and election status
- ✅ **Mobile Responsive**: Works perfectly on all devices

### Subscription Model
- ✅ **Free Tier**: Basic elections with simple eligibility rules
- ✅ **Premium Tier**: Advanced eligibility rules, analytics, custom branding

## 🏗️ Architecture

### Smart Contracts (Leo 3.4.0)

**1. Eligibility Contract** (`eligibility_zkvote_4521.aleo`)
- Verifies voter eligibility through ZK proofs
- Supports NFT holders, credential holders, and whitelisted wallets
- Issues eligibility records with nullifiers

**2. Voting Contract** (`voting_zkvote_4522.aleo`)
- Creates elections with configurable parameters
- Casts encrypted votes with nullifier tracking
- Prevents double voting
- Tracks vote counts per option

**3. Registry Contract** (`registry_zkvote_4521.aleo`)
- Stores election metadata and IPFS hashes
- Links elections to creators
- Tracks election status (active/closed/cancelled)

**4. Subscription Contract** (`subscription_zkvote_4522.aleo`)
- Manages premium subscriptions
- Controls feature access
- Tracks subscription status

### Frontend (Next.js 14)

- **Pages**: Landing, Create Election, Vote, Results, Dashboard, Subscription
- **Components**: Wallet connection, Eligibility check, Vote form, Results chart
- **Storage**: IPFS (Pinata) for metadata, LocalStorage for caching
- **Wallet**: Puzzle Wallet SDK integration

## 📋 Prerequisites

- **Leo CLI 3.4.0**: [Install Guide](https://leo-lang.org)
- **Node.js 18+**: [Download](https://nodejs.org)
- **Puzzle Wallet**: [Install Extension](https://puzzle.online)
- **Pinata Account**: [Sign Up](https://app.pinata.cloud) (for IPFS storage)

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd ZK-Vote
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Set Up Environment Variables

Copy the template and fill in your values:

```bash
cp env.local.template .env.local
```

Edit `.env.local`:

```env
# Aleo Program IDs (from deployment)
NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID=eligibility_zkvote_4521.aleo
NEXT_PUBLIC_VOTING_PROGRAM_ID=voting_zkvote_4522.aleo
NEXT_PUBLIC_REGISTRY_PROGRAM_ID=registry_zkvote_4521.aleo
NEXT_PUBLIC_SUBSCRIPTION_PROGRAM_ID=subscription_zkvote_4522.aleo

# Aleo RPC Endpoint
NEXT_PUBLIC_ALEO_RPC_URL=https://api.explorer.provable.com/v2

# Pinata API (for IPFS)
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token

# Network
NEXT_PUBLIC_NETWORK=testnet
```

**Get Pinata JWT:**
1. Sign up at https://app.pinata.cloud/
2. Go to API Keys section
3. Create a new JWT token
4. Copy and paste into `.env.local`

## 🚀 Deployment

### Deploy Smart Contracts

**Using WSL (Recommended):**

```bash
cd /mnt/c/Users/BMSIT/Desktop/ZK-Vote
chmod +x scripts/deploy-wsl.sh
./scripts/deploy-wsl.sh
```

The script will:
- Build all 4 contracts
- Deploy them to Aleo Testnet
- Show you the program IDs

**Manual Deployment:**

For each contract:

```bash
cd contracts/eligibility_zkvote_4521
leo build
leo deploy \
  --private-key $PRIVATE_KEY \
  --network testnet \
  --endpoint https://api.explorer.provable.com/v2 \
  --broadcast \
  --yes
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## 📖 How It Works

### 1. Creating an Election

1. Admin connects Puzzle Wallet
2. Fills in election details (name, description, options, eligibility rules)
3. Metadata is uploaded to IPFS via Pinata
4. Election contract is created on-chain
5. Metadata is registered in registry contract
6. Election is ready for voting

### 2. Voting Process

1. Voter visits election page
2. Connects Puzzle Wallet
3. Clicks "Check Eligibility"
4. System generates ZK proof of eligibility (without revealing identity)
5. Eligibility record is issued on-chain
6. Voter selects their choice
7. Vote is encrypted and submitted to voting contract
8. Nullifier prevents double voting
9. Vote is permanently stored on-chain

### 3. Viewing Results

1. Anyone can view results page
2. Vote counts are read from on-chain mappings
3. Results are displayed with charts and percentages
4. Cryptographic proofs can be verified on Aleo Explorer
5. Individual votes remain anonymous

## 🔐 Security Features

- **Zero-Knowledge Proofs**: Eligibility verified without revealing identity
- **Encrypted Storage**: Votes encrypted before on-chain storage
- **Nullifier System**: Prevents double voting cryptographically
- **Public Verification**: Anyone can verify vote integrity
- **On-Chain Immutability**: Votes cannot be altered or deleted

## 📊 Current Deployment Status

- ✅ **Registry Contract**: Deployed (`registry_zkvote_4521.aleo`)
- ✅ **Eligibility Contract**: Deployed (`eligibility_zkvote_4521.aleo`)
- 🔄 **Voting Contract**: Ready (`voting_zkvote_4522.aleo`)
- 🔄 **Subscription Contract**: Ready (`subscription_zkvote_4522.aleo`)

See `DEPLOYMENT_STATUS.md` for latest status.

## 🎨 UI/UX Features

- **Modern Design**: Light blue (#60A5FA, #3B82F6) and white color scheme
- **Smooth Animations**: Fade-in and slide-up effects
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Loading States**: Clear feedback during async operations
- **Error Handling**: User-friendly error messages
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📁 Project Structure

```
ZK-Vote/
├── contracts/                    # Leo smart contracts
│   ├── eligibility_zkvote_4521/
│   │   ├── program.json
│   │   └── src/main.leo
│   ├── voting_zkvote_4521/
│   ├── registry_zkvote_4521/
│   └── subscription_zkvote_4521/
├── frontend/                     # Next.js application
│   ├── app/                     # Next.js app directory
│   │   ├── page.tsx            # Landing page
│   │   ├── create/             # Create election
│   │   ├── vote/[electionId]/  # Vote page
│   │   ├── results/[electionId]/ # Results page
│   │   ├── dashboard/          # Admin dashboard
│   │   └── subscription/        # Subscription management
│   ├── components/              # React components
│   │   ├── WalletConnect.tsx
│   │   ├── WalletProvider.tsx
│   │   ├── Navbar.tsx
│   │   └── ResultsChart.tsx
│   ├── lib/                     # Utility libraries
│   │   ├── aleo.ts             # Aleo SDK wrapper
│   │   ├── puzzle.ts           # Puzzle Wallet integration
│   │   ├── pinata.ts           # IPFS integration
│   │   ├── aleo-contracts.ts   # Contract interaction helpers
│   │   └── election-storage.ts # Election data management
│   └── package.json
├── scripts/                      # Deployment scripts
│   ├── deploy-wsl.sh           # WSL deployment script
│   ├── deploy.sh               # Linux/Mac script
│   └── deploy.ps1              # Windows PowerShell script
├── README.md                    # This file
├── DEPLOYMENT.md                # Deployment guide
├── ENV_SETUP.md                 # Environment setup guide
└── MISTAKES.md                  # Common mistakes to avoid
```

## 🔧 Environment Variables

### Required

- `NEXT_PUBLIC_ELIGIBILITY_PROGRAM_ID` - Eligibility contract program ID
- `NEXT_PUBLIC_VOTING_PROGRAM_ID` - Voting contract program ID
- `NEXT_PUBLIC_REGISTRY_PROGRAM_ID` - Registry contract program ID
- `NEXT_PUBLIC_SUBSCRIPTION_PROGRAM_ID` - Subscription contract program ID
- `NEXT_PUBLIC_ALEO_RPC_URL` - Aleo RPC endpoint

### Optional but Recommended

- `NEXT_PUBLIC_PINATA_JWT` - Pinata JWT for IPFS storage (highly recommended)
- `MONGODB_URI` - MongoDB connection string (only if using MongoDB)

See `ENV_SETUP.md` for detailed instructions.

## 🧪 Testing

### Test Contract Deployment

```bash
cd contracts/eligibility_zkvote_4521
leo build
```

### Test Frontend

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000 and test:
1. Wallet connection
2. Creating an election
3. Voting flow
4. Viewing results

## 🐛 Troubleshooting

### Contracts Won't Deploy

- Check Leo CLI version: `leo --version` (should be 3.4.0)
- Verify private key has sufficient credits
- Ensure program names are unique
- Check network connectivity

### Frontend Can't Connect

- Verify Puzzle Wallet extension is installed and unlocked
- Check program IDs in `.env.local` match deployed contracts
- Ensure RPC endpoint is correct
- Check browser console for errors

### IPFS Upload Fails

- Verify Pinata JWT is correct and not expired
- Check you have sufficient Pinata credits
- Ensure network connectivity

See `MISTAKES.md` for common issues and solutions.

## 📚 Documentation

- **README.md** - This file (overview and quick start)
- **DEPLOYMENT.md** - Detailed deployment instructions
- **ENV_SETUP.md** - Environment variable setup guide
- **MISTAKES.md** - Common mistakes and how to avoid them
- **DEPLOYMENT_STATUS.md** - Current deployment status

## 🛡️ Security Best Practices

1. **Never commit `.env.local`** - Keep it in `.gitignore`
2. **Use environment variables** - Don't hardcode sensitive data
3. **Verify contract addresses** - Always double-check program IDs
4. **Test on testnet first** - Never deploy to mainnet without testing
5. **Keep dependencies updated** - Regularly update npm packages
6. **Validate user input** - Always validate form inputs
7. **Handle errors gracefully** - Show user-friendly error messages

## 🌐 Production Deployment

### Frontend Deployment

Deploy to Vercel, Netlify, or your preferred hosting:

1. Connect your repository
2. Set environment variables in hosting platform
3. Deploy

### Mainnet Deployment

1. Change network to `mainnet` in deployment script
2. Update frontend `.env.local` to use mainnet RPC
3. Deploy contracts with mainnet private key
4. Update frontend program IDs

## 🤝 Contributing

This project is built for the Aleo Privacy Buildathon. Contributions welcome!

## 📄 License

MIT License

## 🙏 Acknowledgments

- Built for **Aleo Privacy Buildathon by AKINDO**
- Powered by **Aleo** - The private internet infrastructure
- Wallet integration via **Puzzle Wallet**
- IPFS storage via **Pinata**

## 🔗 Useful Links

- [Aleo Documentation](https://developer.aleo.org)
- [Leo Language Docs](https://docs.leo-lang.org)
- [Puzzle Wallet Docs](https://docs.puzzle.online)
- [Pinata Documentation](https://docs.pinata.cloud)
- [Aleo Explorer](https://explorer.aleo.org)

## 💡 What Makes ZK-Vote Special?

1. **True Privacy**: Unlike transparent blockchains, Aleo enables private voting by default
2. **ZK Proofs**: Eligibility verified without revealing who you are
3. **Public Verification**: Anyone can verify results without seeing individual votes
4. **Production Ready**: Fully functional end-to-end with proper error handling
5. **Modern UX**: Beautiful, intuitive interface that anyone can use
6. **On-Chain Everything**: Votes, eligibility, results - all stored on-chain

---

**Ready to build the future of private voting?** 🚀

Deploy ZK-Vote and start conducting anonymous, verifiable elections today!
