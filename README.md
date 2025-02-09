
# PolyGen: AI-Powered 3D Asset Generation & NFT Marketplace 🎨

[![Built with CDP AgentKit](https://img.shields.io/badge/Built%20with-CDP%20AgentKit-blue)](https://docs.cdp.coinbase.com/agentkit/docs/welcome)
[![Network](https://img.shields.io/badge/Network-Base-green)](https://base.org)

## 🌟 Overview

PolyGen revolutionizes the 3D asset creation and NFT marketplace landscape by combining cutting-edge AI technology with blockchain innovation. Built on the Base network using Coinbase Developer Platform (CDP) AgentKit, PolyGen enables creators to transform text descriptions into stunning 3D models and seamlessly mint them as NFTs.

### 🎯 The Problem We're Solving

Traditional 3D asset creation requires:
- Extensive technical expertise
- Expensive software licenses
- Time-consuming modeling processes
- Complex blockchain integration

PolyGen democratizes this process, making it accessible to everyone through natural language interactions and automated workflows.

## ✨ Key Features

- 🤖 **AI-Powered 3D Generation**: Transform text descriptions into detailed 3D models using Meshy.ai integration
- 🎨 **Style Customization**: Specify art styles and refinements through natural language
- 💎 **One-Click NFT Minting**: Seamless NFT creation on the Base network
- 🔗 **CDP AgentKit Integration**: Secure wallet management and blockchain interactions
- 💬 **Natural Language Interface**: Chat-based interaction for all features
- 🔄 **Autonomous Mode**: Let the agent operate independently for batch operations

## 🛠️ Technology Stack

- **Blockchain**: Base Network (Ethereum L2)
- **Smart Contracts**: Thirdweb
- **AI/ML**: OpenAI GPT-4, Meshy.ai
- **Backend**: Node.js, TypeScript
- **Framework**: CDP AgentKit, LangChain
- **Storage**: IPFS (via Thirdweb)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- CDP API Keys
- OpenAI API Key
- Meshy.ai API Key
- Thirdweb API Key

### Environment Variables

```env
OPENAI_API_KEY=your_openai_key
CDP_API_KEY_NAME=your_cdp_key_name
CDP_API_KEY_PRIVATE_KEY=your_cdp_private_key
MESHY_API_KEY=your_meshy_key
THIRDWEB_CLIENT_ID=your_thirdweb_client_id
CONTRACT_ADDRESS=your_nft_contract_address
ACCOUNT_PRIVATE_KEY=your_wallet_private_key
NETWORK_ID=base-sepolia
```

### Installation

1. Fork this repository on Replit
2. Add environment variables via Replit Secrets
3. Click "Run" to start the development server

### Usage Modes

1. **Chat Mode**: Interactive conversation with the agent
```bash
Choose mode: 1
```

2. **Autonomous Mode**: Let the agent operate independently
```bash
Choose mode: 2
```

## 🎨 Frontend Implementation

The frontend repository for PolyGen is available at [PolyGen Frontend Demo](https://replit.com/@username/polygen-frontend). It provides:

- Intuitive text-to-3D interface
- Real-time 3D model previews
- NFT minting dashboard
- Transaction history
- Wallet integration

To connect the frontend:
1. Fork the frontend repository
2. Update the API endpoint in the frontend configuration
3. Run both repositories simultaneously

## 🔧 Technical Architecture

PolyGen leverages CDP AgentKit's powerful features:
- Secure wallet management
- Blockchain transaction handling
- Smart contract interactions
- Multi-chain support

The system follows this workflow:
1. Text prompt processing
2. 3D model generation via Meshy.ai
3. IPFS storage of assets
4. NFT minting on Base
5. Transaction verification

## 🏆 Innovation Highlights

- AI agent specifically designed for 3D NFT creation
- Seamless integration with Base network
- Production-ready security with CDP AgentKit
- Scalable architecture supporting AI models

## 🙏 Acknowledgments

- Coinbase Developer Platform team
- Base network team
- Meshy.ai team
- ThirdWeb team

Built with ❤️ for the Agentic Ethereum Hackathon
