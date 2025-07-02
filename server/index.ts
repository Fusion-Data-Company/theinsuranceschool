import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { registerN8nDirectEndpoints } from "./n8n-direct";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register N8N direct endpoints first
  registerN8nDirectEndpoints(app);
  
  const server = await registerRoutes(app);

  // STEP 5: Comprehensive Error Handling for MCP Integration
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    console.error(`[SERVER ERROR] ${new Date().toISOString()} - ${err.stack}`);
    console.error(`Request URL: ${req.url}, Method: ${req.method}`);
    console.error(`Request Headers: ${JSON.stringify(req.headers)}`);
    
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ 
      success: false, 
      error: message,
      timestamp: new Date().toISOString(),
      request_id: req.get('x-request-id') || 'unknown'
    });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Keep-alive mechanism for n8n integration
    // Ping the server every 4 minutes to prevent Replit from sleeping
    const KEEP_ALIVE_INTERVAL = 4 * 60 * 1000; // 4 minutes
    
    setInterval(() => {
      const timestamp = new Date().toISOString();
      console.log(`[KEEP-ALIVE] ${timestamp} - Server heartbeat for n8n`);
      
      // Ping our own health endpoint to keep everything warm
      fetch('http://localhost:5000/api/mcp/health')
        .then(res => res.json())
        .then(data => console.log(`[KEEP-ALIVE] Health check OK:`, data.status))
        .catch(err => console.error(`[KEEP-ALIVE] Health check failed:`, err.message));
    }, KEEP_ALIVE_INTERVAL);
    
    log(`Keep-alive mechanism enabled - server will stay awake for n8n`);
  });
})();
