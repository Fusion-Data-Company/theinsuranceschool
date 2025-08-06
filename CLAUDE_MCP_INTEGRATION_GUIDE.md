# Claude Desktop MCP Integration Guide
## Insurance School Lead Data Management System

## 1. MCP SERVER CONNECTION INFO

### Available MCP Tools/Endpoints (12 Functions)

**Analytics & Metrics Tools:**
- `leads_today` - Get today's new leads count
- `enrollments_today` - Get today's enrollments count  
- `qualified_leads` - Get qualified leads ready for enrollment
- `revenue_today` - Get today's completed payment revenue
- `conversion_rate` - Get lead to enrollment conversion rate

**Data Access Tools:**
- `dashboard_data` - Complete database dump (leads, enrollments, payments, calls, analytics)
- `enrollment_breakdown` - Enrollment statistics by course type (2-15, 2-40, 2-14)
- `license_types` - License type breakdown across all leads
- `agent_performance` - AI agent confidence scores (24hr average)
- `call_summary` - Call activity summary with interest levels
- `recent_activity` - Recent lead activity feed
- `chat_memory` - Chat history data with UUID keys

### Server Configuration for Claude Desktop

**Add to Claude Desktop config file (`claude_desktop_config.json`):**

```json
{
  "mcpServers": {
    "insurance-school-analytics": {
      "command": "node",
      "args": ["-e", "
        const http = require('http');
        const { spawn } = require('child_process');
        
        // MCP Server Proxy for Claude Desktop
        const server = http.createServer((req, res) => {
          if (req.method === 'POST' && req.url === '/mcp') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              const request = require('https').request({
                hostname: 'a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev',
                port: 443,
                path: '/api/mcp',
                method: 'POST',
                headers: {
                  'Authorization': 'Bearer Ry27942001$',
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(body)
                }
              }, (response) => {
                res.writeHead(response.statusCode, response.headers);
                response.pipe(res);
              });
              request.write(body);
              request.end();
            });
          } else if (req.url === '/discover') {
            const request = require('https').request({
              hostname: 'a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev',
              port: 443,
              path: '/api/mcp-discover',
              method: 'GET'
            }, (response) => {
              res.writeHead(response.statusCode, response.headers);
              response.pipe(res);
            });
            request.end();
          }
        });
        
        server.listen(0, () => {
          console.log(JSON.stringify({
            type: 'server_info',
            port: server.address().port
          }));
        });
      "],
      "env": {
        "MCP_SERVER_URL": "https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev",
        "MCP_AUTH_TOKEN": "Ry27942001$"
      }
    }
  }
}
```

### Authentication Credentials

**Required Authentication:**
- **Token**: `Ry27942001$`
- **Header Format**: `Authorization: Bearer Ry27942001$`
- **Server URL**: `https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev`

## 2. LEAD DATA ENDPOINTS

### ⚠️ Important Limitation
**Current MCP tools are READ-ONLY analytics functions. The MCP server does NOT provide direct CRUD operations for leads.**

**Available Read Operations:**
- `dashboard_data` - Returns complete lead database with all records
- `qualified_leads` - Returns count of qualified leads
- `leads_today` - Returns today's new leads count
- `recent_activity` - Returns recent lead activity

### For Lead Management Operations, Use Direct API Calls:

**CREATE New Leads:**
```bash
POST /api/leads
Authorization: Not required for lead creation
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe", 
  "phone": "555-123-4567",
  "email": "john@example.com",
  "licenseGoal": "2-15",
  "source": "voice_agent",
  "status": "new"
}
```

**UPDATE Existing Leads:**
```bash
PATCH /api/leads/{leadId}
Content-Type: application/json

{
  "status": "qualified",
  "paymentStatus": "PAID",
  "painPoints": "Wants career change"
}
```

**SEARCH/QUERY Leads:**
```bash
GET /api/leads?phone=555-123-4567
GET /api/leads?email=john@example.com
GET /api/leads?status=qualified
```

**RETRIEVE Call Transcripts:**
```bash
GET /api/call-records
GET /api/call-records?leadId={leadId}
```

## 3. SPECIFIC DATA OPERATIONS

### Insert New Lead Data from Call Transcripts

**Method 1: Direct API Call**
```javascript
const response = await fetch('https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: "extracted_from_transcript",
    lastName: "extracted_from_transcript", 
    phone: "extracted_phone",
    email: "extracted_email",
    licenseGoal: "2-15", // or 2-40, 2-14
    source: "voice_agent",
    status: "new",
    painPoints: "extracted_pain_points",
    employmentStatus: "extracted_employment",
    urgencyLevel: "Medium",
    callSummary: "full_transcript_summary"
  })
});
```

**Method 2: Use ElevenLabs Webhook (Automated)**
```bash
POST /api/webhooks/elevenlabs-agent-data
Content-Type: application/json

{
  "phone": "555-NEW-LEAD",
  "firstName": "Jane",
  "lastName": "Smith", 
  "email": "jane@example.com",
  "licenseGoal": "2-40",
  "status": "qualified",
  "source": "voice_agent",
  "painPoints": "Career advancement",
  "callSummary": "Interested in property insurance"
}
```

### Update Lead Status, Payment Info, Enrollment Details

**Update Lead Status:**
```bash
PATCH /api/leads/{leadId}
{
  "status": "qualified",
  "paymentStatus": "PAID",
  "paymentPreference": "payment_plan"
}
```

**Add Payment Record:**
```bash
POST /api/payments
{
  "leadId": 123,
  "planChosen": "299_down",
  "amount": "299.00",
  "status": "completed"
}
```

**Add Enrollment:**
```bash
POST /api/enrollments  
{
  "leadId": 123,
  "course": "2-15_life_health",
  "cohort": "evening",
  "startDate": "2025-08-15T00:00:00Z"
}
```

### Lead Data Schema Format

```typescript
interface Lead {
  // Required Fields
  firstName: string;
  lastName: string; 
  phone: string;           // varchar(20)
  email: string;
  licenseGoal: string;     // "2-15" | "2-40" | "2-14"
  
  // Optional Fields
  source?: string;         // default: "voice_agent"
  status?: string;         // default: "new" | "contacted" | "qualified" | "enrolled" | "opt_out"
  painPoints?: string;
  employmentStatus?: string;
  urgencyLevel?: string;
  paymentPreference?: string;
  paymentStatus?: string;  // default: "NOT_PAID"
  confirmationNumber?: string;
  agentName?: string;
  supervisor?: string;     // default: "Kelli Kirk"
  leadSource?: string;
  callSummary?: string;
  callDate?: Date;
  conversationId?: string;
}
```

### Bulk Operations

**Bulk Lead Creation:**
```bash
POST /api/leads/bulk
Content-Type: application/json

{
  "leads": [
    {
      "firstName": "Lead1",
      "lastName": "Test",
      "phone": "555-0001", 
      "email": "lead1@test.com",
      "licenseGoal": "2-15"
    },
    {
      "firstName": "Lead2", 
      "lastName": "Test",
      "phone": "555-0002",
      "email": "lead2@test.com", 
      "licenseGoal": "2-40"
    }
  ]
}
```

## 4. INTEGRATION DETAILS

### Server Connection Method
- **Transport**: HTTP/HTTPS (not stdio)
- **Protocol**: Server-Sent Events (SSE) for MCP
- **Base URL**: `https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev`

### Required Environment Variables
```bash
MCP_SERVER_URL=https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev
MCP_AUTH_TOKEN=Ry27942001$
```

### Rate Limits & Restrictions
- **No explicit rate limits** currently implemented
- **Authentication required** for MCP tool execution
- **Public discovery endpoint** available without auth
- **Server stays awake** with keep-alive mechanism for n8n integration

### Key Endpoints Summary

| Endpoint | Method | Auth Required | Purpose |
|----------|---------|---------------|---------|
| `/api/mcp-discover` | GET | No | Tool discovery |
| `/api/mcp` | GET/POST | Yes | MCP execution |
| `/api/leads` | GET/POST/PATCH | No | Lead CRUD |
| `/api/call-records` | GET | No | Call data |
| `/api/payments` | GET/POST | No | Payment data |
| `/api/enrollments` | GET/POST | No | Enrollment data |
| `/api/webhooks/elevenlabs-agent-data` | POST | No | Auto lead creation |

### Testing MCP Connection

**Test discovery:**
```bash
curl https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp-discover
```

**Test tool execution:**
```bash
curl -X POST https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp \
  -H "Authorization: Bearer Ry27942001$" \
  -H "Content-Type: application/json" \
  -d '{"tool_name": "leads_today", "arguments": {}}'
```

## Summary

Your MCP server provides comprehensive **READ ACCESS** to insurance school data through 12 analytics functions. For **WRITE OPERATIONS** (creating/updating leads), use the direct REST API endpoints. Claude can use MCP tools for data analysis and the REST API for lead management operations.