# MCP Server Technical Specification Report
**Insurance School Recruiting Analytics MCP Server for ElevenLabs Integration**

---

## 🔧 SERVER CONFIGURATION

### Base URL & Endpoints
- **Production URL**: `https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev`
- **Discovery Endpoint**: `/api/mcp-discover` (Public, no auth required)
- **SSE Connection**: `/api/mcp` (Authenticated)
- **Tool Execution**: `POST /api/mcp` (Authenticated)
- **Health Check**: `/api/mcp/health` (Authenticated)
- **Legacy Tool Call**: `POST /api/mcp/call` (Authenticated, backup endpoint)

### Authentication
- **Type**: Bearer Token
- **Token**: `Ry27942001$`
- **Header Format**: `Authorization: Bearer Ry27942001$`
- **Discovery Bypass**: Public discovery endpoint bypasses authentication

### Transport Protocol
- **Primary**: Server-Sent Events (SSE)
- **Content-Type**: `text/event-stream`
- **Protocol**: Model Context Protocol (MCP) v2024-11-05
- **Format**: JSON-RPC 2.0 compliant

---

## 📡 MCP PROTOCOL IMPLEMENTATION

### Server Information Response
```json
{
  "server": {
    "name": "Insurance School Recruiting Analytics",
    "version": "1.0.0",
    "url": "https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp",
    "transport": "sse",
    "authentication": {
      "required": true,
      "type": "bearer"
    }
  },
  "tools_count": 10,
  "status": "ready"
}
```

### SSE Connection Headers
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type, Authorization
X-Accel-Buffering: no
```

### Initialization Message
```json
{
  "jsonrpc": "2.0",
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {}
    },
    "clientInfo": {
      "name": "Insurance School Recruiting Analytics",
      "version": "1.0.0"
    }
  }
}
```

---

## 🛠️ AVAILABLE TOOLS (10 Total)

### 1. enrollments_today
- **Description**: Get the number of new enrollments today
- **Input Schema**: `{}`
- **Example Response**: `"14 new enrollments today"`
- **Database Query**: Count enrollments created today

### 2. leads_today
- **Description**: Get the number of new leads captured today
- **Input Schema**: `{}`
- **Example Response**: `"8 new leads captured today"`
- **Database Query**: Count leads created today

### 3. qualified_leads
- **Description**: Get the number of qualified leads ready for enrollment
- **Input Schema**: `{}`
- **Example Response**: `"12 qualified leads ready for enrollment"`
- **Database Query**: Count leads with status = "qualified"

### 4. enrollment_breakdown
- **Description**: Get enrollment statistics broken down by course type
- **Input Schema**: `{}`
- **Example Response**: `"Enrollment breakdown: 2-15_life: 8, 2-40_life: 4, 2-14_health: 2"`
- **Database Query**: Group enrollments by course type

### 5. revenue_today
- **Description**: Get total completed payments revenue for today
- **Input Schema**: `{}`
- **Example Response**: `"$1250 in completed payments today"`
- **Database Query**: Sum completed payments created today

### 6. agent_performance
- **Description**: Get average agent confidence score over last 24 hours
- **Input Schema**: `{}`
- **Example Response**: `"Average agent confidence score: 87.5% over last 24 hours"`
- **Database Query**: Average confidence from agent_metrics table

### 7. call_summary
- **Description**: Get call activity summary for today
- **Input Schema**: `{}`
- **Example Response**: `"15 calls today, 8 showed interest"`
- **Database Query**: Count total calls and interested calls for today

### 8. license_types
- **Description**: Get breakdown of license types leads are interested in
- **Input Schema**: `{}`
- **Example Response**: `"License interest breakdown: 2-15: 15, 2-40: 8, 2-14: 3"`
- **Database Query**: Group leads by license_goal field

### 9. recent_activity
- **Description**: Get the 5 most recent leads and their status
- **Input Schema**: `{}`
- **Example Response**: `"Recent leads: John Smith (qualified), Jane Doe (contacted), Mike Johnson (new)"`
- **Database Query**: Select 5 most recent leads with names and status

### 10. conversion_rate
- **Description**: Get lead to enrollment conversion rate
- **Input Schema**: `{}`
- **Example Response**: `"Conversion rate: 25.0% (6/24)"`
- **Database Query**: Calculate enrolled leads / total leads percentage

---

## 🗄️ DATABASE SCHEMA

### PostgreSQL Tables Used
- **leads**: Lead information and status tracking
- **enrollments**: Course enrollment records
- **call_records**: Call transcripts and analytics
- **payments**: Payment transactions and status
- **agent_metrics**: AI agent performance data

### Key Database Fields
```sql
-- leads table
leads {
  id: integer (primary key)
  firstName: varchar
  lastName: varchar
  phone: varchar
  email: varchar
  status: varchar (new, contacted, qualified, enrolled, opt_out)
  licenseGoal: varchar (2-15, 2-40, 2-14)
  createdAt: timestamp
}

-- enrollments table
enrollments {
  id: integer (primary key)
  leadId: integer (foreign key)
  course: varchar
  cohort: varchar
  status: varchar
  createdAt: timestamp
}

-- payments table
payments {
  id: integer (primary key)
  leadId: integer (foreign key)
  amount: decimal
  status: varchar (pending, completed, failed, refunded)
  createdAt: timestamp
}

-- call_records table
call_records {
  id: integer (primary key)
  leadId: integer (foreign key)
  callSid: varchar
  duration: integer
  transcript: text
  intent: varchar
  createdAt: timestamp
}

-- agent_metrics table
agent_metrics {
  id: integer (primary key)
  callRecordId: integer (foreign key)
  confidence: decimal
  sentiment: varchar
  createdAt: timestamp
}
```

---

## 🌐 CORS & MIDDLEWARE CONFIGURATION

### CORS Headers
```javascript
'Access-Control-Allow-Origin': '*'
'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept'
'Access-Control-Expose-Headers': 'Content-Type'
```

### Authentication Middleware
```javascript
const authenticateMCP = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const expectedToken = "Ry27942001$";
  
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization required" });
  }

  const token = authHeader.replace("Bearer ", "");
  if (token !== expectedToken) {
    return res.status(401).json({ error: "Invalid authentication" });
  }

  next();
};
```

---

## 📞 TOOL EXECUTION METHODS

### Method 1: Direct POST to /api/mcp (Primary)
```bash
curl -X POST \
  -H "Authorization: Bearer Ry27942001$" \
  -H "Content-Type: application/json" \
  -d '{"tool_name":"enrollments_today","arguments":{}}' \
  https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp
```

**Response Format:**
```json
{
  "result": "14 new enrollments today",
  "success": true,
  "timestamp": "2025-06-26T15:06:07.740Z"
}
```

### Method 2: JSON-RPC POST to /api/mcp/call (Legacy)
```bash
curl -X POST \
  -H "Authorization: Bearer Ry27942001$" \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/call","params":{"name":"enrollments_today","arguments":{}}}' \
  https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp/call
```

---

## 🔍 TESTING & VERIFICATION COMMANDS

### Discovery Test (No Auth)
```bash
curl -s https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp-discover
```

### Health Check
```bash
curl -s -H "Authorization: Bearer Ry27942001$" \
  https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp/health
```

### SSE Connection Test
```bash
curl -s -H "Authorization: Bearer Ry27942001$" \
  -H "Accept: text/event-stream" \
  https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp
```

### Tool Execution Test
```bash
curl -s -X POST \
  -H "Authorization: Bearer Ry27942001$" \
  -H "Content-Type: application/json" \
  -d '{"tool_name":"qualified_leads","arguments":{}}' \
  https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp
```

---

## ⚠️ KNOWN ISSUES & TROUBLESHOOTING

### Issue 1: Route Registration Order
**Problem**: MCP endpoints were being intercepted by frontend routing
**Solution**: Moved MCP endpoint registration before Vite frontend catch-all routes
**File**: `server/routes.ts` - registerMCPEndpoint(app) called first

### Issue 2: Authentication Token Format
**Problem**: Token validation failing
**Solution**: Ensure Bearer token format: `Authorization: Bearer Ry27942001$`
**Note**: Token must match exactly, case-sensitive

### Issue 3: SSE Connection Timeouts
**Problem**: ElevenLabs losing connection
**Solution**: Implemented 30-second heartbeat with ping messages
**Implementation**: setInterval sending ping data every 30 seconds

### Issue 4: CORS Preflight Issues
**Problem**: OPTIONS requests failing
**Solution**: Added OPTIONS handler that returns 200 immediately
**Headers**: Proper CORS headers for all MCP endpoints

---

## 📊 CURRENT OPERATIONAL STATUS

### Server Health
- ✅ Discovery endpoint responding (200 OK)
- ✅ Authentication working (Bearer token validation)
- ✅ SSE connection established successfully
- ✅ All 10 tools returning live database data
- ✅ Health check endpoint operational
- ✅ Route registration order fixed

### Database Connectivity
- ✅ PostgreSQL connection active via Neon serverless
- ✅ Drizzle ORM queries executing successfully
- ✅ Real-time data from production database
- ✅ All table relationships working correctly

### ElevenLabs Integration Status
- ✅ MCP protocol compliance verified
- ✅ JSON-RPC 2.0 format implemented
- ✅ SSE transport layer functional
- ✅ Tool discovery mechanism working
- ✅ Authentication flow complete

---

## 🔧 IMPLEMENTATION FILES

### Primary Files
- `server/mcp.ts` - Main MCP server implementation (596 lines)
- `server/routes.ts` - Route registration and ordering
- `server/db.ts` - Database connection and configuration
- `shared/schema.ts` - Database schema definitions
- `mcp-manifest.json` - Tool manifest for ElevenLabs

### Configuration Files
- `drizzle.config.ts` - Database configuration
- `package.json` - Dependencies and scripts
- `.env` - Environment variables (DATABASE_URL)

### Testing Files
- `test-mcp.js` - MCP endpoint testing utility
- `MCP_INTEGRATION_GUIDE.md` - Integration documentation

---

## 🚀 DEPLOYMENT INFORMATION

### Environment
- **Platform**: Replit (Node.js runtime)
- **Database**: Neon PostgreSQL (serverless)
- **Framework**: Express.js with TypeScript
- **Build Tool**: Vite + ESBuild

### Environment Variables Required
```bash
DATABASE_URL=postgresql://[credentials]@[host]/[database]
MCP_SECRET_TOKEN=Ry27942001$
PGHOST=[host]
PGPORT=5432
PGUSER=[username]
PGPASSWORD=[password]
PGDATABASE=[database]
```

### Startup Command
```bash
npm run dev
# Runs: NODE_ENV=development tsx server/index.ts
```

---

## 📋 TECHNICAL REQUIREMENTS FOR ELEVENLABS

### Required Headers for Connection
```
Authorization: Bearer Ry27942001$
Accept: text/event-stream
Content-Type: application/json (for POST requests)
```

### Expected Connection Flow
1. **Discovery**: GET `/api/mcp-discover` (no auth)
2. **Connect**: GET `/api/mcp` with Bearer token (SSE stream)
3. **Execute**: POST `/api/mcp` with tool_name and arguments

### Tool Response Format
All tools return consistent format:
```json
{
  "result": "Human-readable response string",
  "success": true,
  "timestamp": "ISO 8601 timestamp"
}
```

---

**Report Generated**: June 26, 2025
**Server Version**: 1.0.0
**MCP Protocol**: v2024-11-05
**Status**: Fully Operational ✅