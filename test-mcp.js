// Test script for MCP endpoint
import fetch from 'node-fetch';

const SECRET = process.env.MCP_SECRET_TOKEN || "recruiting-mcp-secret-2024";

async function testMCPEndpoint(query) {
  try {
    const response = await fetch('http://localhost:5000/api/mcp', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = new TextDecoder().decode(value);
      result += chunk;
    }

    console.log(`Query: ${query}`);
    console.log(`Response: ${result}`);
    console.log('---');
    
  } catch (error) {
    console.error(`Error testing "${query}":`, error.message);
  }
}

async function runTests() {
  console.log('Testing MCP Server Endpoints...\n');
  
  const queries = [
    'enrollments_today',
    'leads_today', 
    'qualified_leads',
    'enrollment_breakdown',
    'revenue_today',
    'agent_performance',
    'call_summary',
    'license_types',
    'recent_activity',
    'conversion_rate'
  ];

  for (const query of queries) {
    await testMCPEndpoint(query);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between requests
  }
  
  console.log('Testing complete!');
}

// Run if called directly
if (require.main === module) {
  runTests();
}

module.exports = { testMCPEndpoint };