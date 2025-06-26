# n8n MCP Integration Guide

## Overview

This guide provides step-by-step instructions for integrating the Insurance School Recruiting Annex MCP server with n8n workflows for automated business intelligence and data retrieval.

## MCP Server Configuration

### Available Endpoints

1. **Root Discovery**: `https://your-replit-domain.dev/`
2. **Standard Discovery**: `https://your-replit-domain.dev/api/mcp-discover`
3. **Tool Execution**: `https://your-replit-domain.dev/api/mcp`

### Authentication

- **Bearer Token**: `Ry27942001$`
- **Header**: `Authorization: Bearer Ry27942001$`

## Available Analytics Tools

### 1. leads_today
- **Description**: Today's new leads count
- **Parameters**: None
- **Returns**: Number of leads captured today

### 2. enrollments_today
- **Description**: Today's enrollments count
- **Parameters**: None
- **Returns**: Number of enrollments processed today

### 3. qualified_leads
- **Description**: Qualified leads count
- **Parameters**: None
- **Returns**: Total number of qualified leads

### 4. revenue_today
- **Description**: Today's revenue
- **Parameters**: None
- **Returns**: Total revenue generated today

### 5. agent_performance
- **Description**: Agent performance metrics
- **Parameters**: None
- **Returns**: Performance statistics and scores

### 6. call_summary
- **Description**: Call interactions today
- **Parameters**: None
- **Returns**: Summary of today's call activity

### 7. enrollment_breakdown
- **Description**: Enrollment breakdown by course
- **Parameters**: None
- **Returns**: Course-specific enrollment statistics

### 8. license_types
- **Description**: License type breakdown
- **Parameters**: None
- **Returns**: Distribution of license types (2-15, 2-40, 2-14)

### 9. recent_activity
- **Description**: Recent lead activity
- **Parameters**: None
- **Returns**: Latest lead interactions and updates

### 10. conversion_rate
- **Description**: Lead to enrollment conversion rate
- **Parameters**: None
- **Returns**: Conversion percentage and metrics

## n8n Workflow Configuration

### Step 1: HTTP Request Node

Configure an HTTP Request node in n8n:

```json
{
  "method": "POST",
  "url": "https://your-replit-domain.dev/api/mcp",
  "headers": {
    "Authorization": "Bearer Ry27942001$",
    "Content-Type": "application/json"
  },
  "body": {
    "tool_name": "leads_today",
    "arguments": {}
  }
}
```

### Step 2: Response Processing

The MCP server returns responses in this format:

```json
{
  "result": "6 new leads captured today",
  "success": true,
  "timestamp": "2025-06-26T17:18:13.832Z"
}
```

### Step 3: Conditional Logic

Use n8n's conditional nodes to process different tool responses:

```javascript
// Check if MCP call was successful
if (items[0].json.success) {
  // Process the result
  const result = items[0].json.result;
  return [{ json: { data: result } }];
} else {
  // Handle error
  return [{ json: { error: "MCP call failed" } }];
}
```

## Example n8n Workflows

### Daily Report Workflow

1. **Trigger**: Cron trigger for daily execution
2. **MCP Calls**: Parallel HTTP requests for:
   - leads_today
   - enrollments_today
   - revenue_today
   - conversion_rate
3. **Data Processing**: Combine results into report
4. **Output**: Send email/Slack notification with metrics

### Real-time Alert Workflow

1. **Trigger**: Webhook from CRM system
2. **MCP Query**: Check current metrics
3. **Conditional**: If metrics exceed thresholds
4. **Action**: Send alert notification

### Dashboard Update Workflow

1. **Trigger**: Scheduled every 15 minutes
2. **MCP Calls**: Fetch all analytics tools
3. **Processing**: Format data for dashboard
4. **Output**: Update external dashboard/database

## Error Handling

### Common Issues

1. **Authentication Error (401)**
   - Verify Bearer token is correct
   - Ensure Authorization header is properly formatted

2. **Tool Not Found**
   - Check tool name spelling
   - Verify tool is available in discovery endpoint

3. **Server Error (500)**
   - Check server logs for detailed error information
   - Verify database connectivity

### Retry Logic

Implement retry logic in n8n workflows:

```javascript
// Retry configuration
const maxRetries = 3;
let attempt = 0;

while (attempt < maxRetries) {
  try {
    // Make MCP request
    const response = await makeRequest();
    return response;
  } catch (error) {
    attempt++;
    if (attempt >= maxRetries) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
  }
}
```

## Testing

### Discovery Test

```bash
curl -X GET "https://your-replit-domain.dev/" \
  -H "Content-Type: application/json"
```

### Tool Execution Test

```bash
curl -X POST "https://your-replit-domain.dev/api/mcp" \
  -H "Authorization: Bearer Ry27942001$" \
  -H "Content-Type: application/json" \
  -d '{"tool_name":"leads_today","arguments":{}}'
```

## Monitoring

### Server Logs

The MCP server provides detailed logging for n8n requests:

```
=== N8N MCP REQUEST ===
Timestamp: 2025-06-26T17:18:13.832Z
Method: POST
URL: /api/mcp
Headers: {...}
Body: {"tool_name":"leads_today","arguments":{}}
===========================
```

### Performance Metrics

Monitor these key metrics:
- Response time per tool
- Success/failure rates
- Authentication attempts
- Database query performance

## Security Considerations

1. **Token Rotation**: Regularly update the Bearer token
2. **Rate Limiting**: Implement rate limiting in n8n workflows
3. **Logging**: Monitor for suspicious access patterns
4. **Network Security**: Use HTTPS for all communications

## Support

For issues or questions regarding the MCP integration:
1. Check server logs for detailed error information
2. Verify n8n workflow configuration
3. Test individual MCP endpoints manually
4. Review this guide for common solutions