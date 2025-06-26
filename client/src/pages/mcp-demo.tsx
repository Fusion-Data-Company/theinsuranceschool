import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const predefinedQueries = [
  { label: "Today's Enrollments", query: "enrollments_today" },
  { label: "Today's Leads", query: "leads_today" },
  { label: "Qualified Leads", query: "qualified_leads" },
  { label: "Enrollment Breakdown", query: "enrollment_breakdown" },
  { label: "Today's Revenue", query: "revenue_today" },
  { label: "Agent Performance", query: "agent_performance" },
  { label: "Call Summary", query: "call_summary" },
  { label: "License Types", query: "license_types" },
  { label: "Recent Activity", query: "recent_activity" },
  { label: "Conversion Rate", query: "conversion_rate" },
];

export default function MCPDemo() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuery = async (queryText: string) => {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const SECRET = "recruiting-mcp-secret-2024";
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SECRET}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: queryText })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const text = await res.text();
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          try {
            const parsed = JSON.parse(data);
            setResponse(parsed.result);
          } catch (e) {
            setError("Failed to parse response");
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          MCP Analytics Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test the Model Context Protocol server that ElevenLabs agents use to query registration data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Query Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Analytics Queries</CardTitle>
            <CardDescription>
              Click any button to see the type of data Jason can ask about during calls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {predefinedQueries.map((item) => (
                <Button
                  key={item.query}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuery(item.query)}
                  disabled={loading}
                  className="text-left justify-start"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Query */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Query</CardTitle>
            <CardDescription>
              Test specific queries like "lead:1" to get individual lead details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter custom query (e.g., lead:1)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQuery(query)}
              />
              <Button 
                onClick={() => handleQuery(query)}
                disabled={loading || !query.trim()}
              >
                Query
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Example queries:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>lead:1 - Get details for lead ID 1</li>
                <li>enrollments_today - Today's enrollments</li>
                <li>conversion_rate - Current conversion metrics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            MCP Response
            {loading && <Badge variant="secondary">Processing...</Badge>}
            {error && <Badge variant="destructive">Error</Badge>}
            {response && !loading && <Badge variant="default">Success</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
          
          {response && !loading && (
            <Textarea
              value={response}
              readOnly
              className="min-h-[100px] font-mono text-sm"
              placeholder="MCP response will appear here..."
            />
          )}
          
          {!response && !loading && !error && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Click a query button or enter a custom query to see the MCP response
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Card>
        <CardHeader>
          <CardTitle>ElevenLabs Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">MCP Server Details</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li><strong>Endpoint:</strong> /api/mcp</li>
                <li><strong>Method:</strong> POST</li>
                <li><strong>Response:</strong> Server-Sent Events (SSE)</li>
                <li><strong>Auth:</strong> Bearer Token</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Available Data</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Lead registrations and status</li>
                <li>• Daily enrollment counts</li>
                <li>• Revenue and payment tracking</li>
                <li>• Agent performance metrics</li>
                <li>• License type breakdowns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}