# Varo Card Dispute Management System

An intelligent dispute management platform for Varo Bank that transforms traditional form-filling into an evidence-based investigation system powered by AI agents.

## Overview

This system handles the complete dispute lifecycle—from empathetic intake that decodes merchant confusion, through forensic investigation leveraging GPS/device correlation, to risk-based provisional credit decisions—while flagging ambiguous friendly fraud cases for human review.

## Architecture

### Agent System

The platform uses a **Manager-Subagent + Independent Agent (Hybrid)** pattern:

1. **Case Manager Agent (Manager)**: Conducts empathetic intake, coordinates investigation
2. **Merchant Intelligence Agent (Sub-agent)**: Decodes merchant descriptors
3. **Evidence Correlator Agent (Sub-agent)**: GPS/device correlation analysis
4. **Risk Scoring Agent (Sub-agent)**: Fraud probability and account health assessment
5. **Resolution Agent (Independent)**: Executes decisions and processes credits/chargebacks

### Data Sources

The system integrates 7 data sources:
- GPS location history
- Device fingerprinting
- Card network APIs (Visa/Mastercard)
- Dispute history database
- Account behavior analytics
- Third-party fraud databases
- Family/authorized user data

## Project Structure

```
/app
  /customer
    /dispute/[transactionId]     - Customer dispute intake (mobile)
    /dispute/[id]/resolution     - Resolution outcome screen
  /analyst
    /dashboard                   - Analyst review queue
    /case/[id]                   - Case detail view
  /api
    /agents/chat                 - AI agent communication endpoint
    /disputes
      /create                    - Create new dispute
      /list                      - List disputes with filters
      /[id]                      - Get/update dispute
      /[id]/resolve              - Process analyst decision

/lib
  /agents/aiAgent.ts             - AI agent communication utilities

/components
  /shared
    - RiskBadge.tsx              - Risk level indicator
    - StatusBadge.tsx            - Dispute status badge
    - EvidenceCard.tsx           - Collapsible evidence display

/prisma
  schema.prisma                  - Database schema (SQLite)

/types
  dispute.ts                     - TypeScript type definitions
```

## Features

### Customer Portal
- **Conversational Intake**: Chat-style interface with AI assistance
- **Merchant Decoding**: Translates cryptic descriptors (e.g., "SQ *JOES" → "Joe's Coffee")
- **Smart Challenges**: Gently reminds customers of forgotten subscriptions
- **Evidence Preview**: Shows GPS/device correlation in real-time
- **Resolution Transparency**: Clear explanation of decisions with appeal option

### Analyst Portal
- **Three-Column Dashboard**: Efficient case queue, detail view, and action panel
- **AI-Gathered Evidence**: Pre-analyzed GPS, device, and risk data
- **Risk Scoring**: Fraud likelihood and friendly fraud probability scores
- **Reg E Compliance**: Automated deadline tracking
- **One-Click Decisions**: Approve/deny with AI recommendations

### AI Investigation Features
- **GPS Correlation**: Matches customer location with transaction location
- **Device Fingerprinting**: Identifies known vs. unknown devices
- **Family Usage Detection**: Recognizes authorized user patterns
- **Behavioral Analysis**: Account health and dispute history patterns
- **Fraud Database Checks**: Third-party intelligence integration

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, react-icons
- **Database**: Prisma (SQLite for demo, easily swappable to PostgreSQL)
- **AI Integration**: Custom agent wrapper in `/lib/agents/aiAgent.ts`
- **API**: Next.js API Routes

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Configure environment variables (create `.env.local`):
```env
# AI Agent Configuration (optional - uses mock data if not configured)
MERCHANT_INTELLIGENCE_AGENT_ID=your-agent-id
EVIDENCE_CORRELATOR_AGENT_ID=your-agent-id
RISK_SCORING_AGENT_ID=your-agent-id
CASE_MANAGER_AGENT_ID=your-agent-id
RESOLUTION_AGENT_ID=your-agent-id
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3333](http://localhost:3333)

## Usage

### Customer Flow
1. Navigate to the homepage
2. Click "Customer Portal"
3. Engage with the conversational dispute assistant
4. Review merchant intelligence and evidence
5. Confirm or cancel the dispute
6. View resolution outcome with detailed explanation

### Analyst Flow
1. Navigate to "Analyst Portal"
2. Review the case queue with filters and search
3. Click a case to view detailed evidence
4. Review AI recommendations and investigation results
5. Make a decision (Approve/Deny)
6. Process the decision to trigger resolution

## Key Components

### AI Agent Integration (`lib/agents/aiAgent.ts`)

The `aiAgent.ts` module provides clean interfaces for calling AI agents:

```typescript
// Call individual agents
const merchantData = await callMerchantIntelligenceAgent(transactionData);
const evidence = await callEvidenceCorrelatorAgent(evidenceData);
const riskScore = await callRiskScoringAgent(riskData);

// Call agents in parallel
const results = await callAgentsInParallel([
  { name: 'merchant', promise: callMerchantIntelligenceAgent(...) },
  { name: 'evidence', promise: callEvidenceCorrelatorAgent(...) },
  { name: 'risk', promise: callRiskScoringAgent(...) }
]);
```

**Critical JSON Parsing**: The module includes robust JSON parsing that handles:
- Markdown code blocks (```json)
- Malformed responses
- Nested JSON extraction
- Type-safe response mapping

### Database Schema

The Prisma schema includes:
- **Customer**: Account information and relationships
- **Transaction**: Card transactions with merchant data
- **Dispute**: Full dispute lifecycle tracking
- **Evidence Models**: GPS history, device fingerprints, authorized users
- **Analyst**: Analyst user management
- **FraudFlag**: Third-party fraud intelligence

## Design System

### Colors
- **Primary (Varo Green)**: `#00D4AA` - Positive actions, branding
- **Amber**: Warnings and medium risk
- **Red**: Fraud flags and high risk
- **Purple**: Analyst-specific features

### Component Library
- Risk badges with color-coded severity
- Status badges for dispute states
- Collapsible evidence cards
- Chat-style message bubbles
- Timeline visualizations
- Progress indicators

## API Endpoints

### Disputes
- `POST /api/disputes/create` - Create new dispute with AI investigation
- `GET /api/disputes/list` - List disputes with filters
- `GET /api/disputes/[id]` - Get dispute details
- `PATCH /api/disputes/[id]` - Update dispute
- `POST /api/disputes/[id]/resolve` - Process analyst decision

### Agents
- `POST /api/agents/chat` - Communicate with AI agents

## Mock Data

The system currently uses mock data for demonstration. To connect real data sources:

1. Update Prisma schema for your database (PostgreSQL recommended)
2. Implement actual API integrations in `/app/api/disputes/create/route.ts`
3. Configure AI agent endpoints in environment variables
4. Replace mock responses in `/app/api/agents/chat/route.ts`

## Compliance Features

### Reg E (Regulation E)
- Automatic deadline calculation (10 business days)
- Deadline tracking in analyst dashboard
- Urgent case flagging
- Provisional credit processing

### Audit Trail
- Complete conversation history
- Decision timestamps
- Analyst notes
- Evidence preservation

## Performance Optimizations

- **Parallel Agent Calls**: All investigation agents run simultaneously
- **Optimistic UI Updates**: Immediate feedback for user actions
- **Lazy Loading**: Evidence cards expand on demand
- **Mobile-First**: Responsive design for customer portal

## Security Considerations

- No sensitive data exposed in client-side code
- Agent responses validated and sanitized
- Type-safe API endpoints
- Secure session handling (implement with NextAuth.js)

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live case updates
2. **Advanced Analytics**: Dashboard with dispute trends and fraud patterns
3. **Batch Processing**: Handle multiple disputes simultaneously
4. **Appeal System**: Full appeal workflow for denied disputes
5. **Chargeback Tracking**: Real-time status from card networks
6. **Machine Learning**: Improve fraud detection with historical data

## License

Proprietary - Varo Bank

## Support

For questions or issues, contact the development team.

---

Built with Next.js by Architect, created by the team at Lyzr.
