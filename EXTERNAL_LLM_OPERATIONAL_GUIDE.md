# External LLM Operational Guide for Insurance School Recruiting CRM

## Quick Reference for Working with Replit Agent

### Project Overview
- **Application**: Insurance School Recruiting CRM with AI voice agent integration
- **Current State**: Fully functional application running on port 5000
- **Live Features**: Lead management, analytics dashboard, MCP server, webhook receivers

### How to Request Updates from Replit Agent

#### Getting Current Status
Ask Replit Agent to:
1. Check the application status at http://localhost:5000
2. Review recent API logs in the workflow console
3. Verify database connectivity and data integrity
4. Test specific endpoints or features

Example queries:
- "What's the current status of the application?"
- "Are all API endpoints responding correctly?"
- "Show me the recent lead activity"
- "Test the MCP integration endpoints"

#### Requesting New Features
Provide Replit Agent with:
1. Clear feature description
2. Specific requirements and acceptance criteria
3. Any UI/UX preferences
4. Integration points with existing features

Example format:
```
Feature: SMS notification system
Requirements:
- Send SMS when lead is qualified
- Use Twilio API
- Store message history in database
- Add UI for viewing SMS logs
```

### Key System Components to Monitor

#### 1. API Endpoints Health
- `/api/leads` - Lead management
- `/api/analytics` - Dashboard metrics
- `/api/webhooks/elevenlabs-call` - Voice agent integration
- `/api/mcp/health` - MCP server status

#### 2. Database Tables
- `leads` - Core customer data
- `call_records` - Voice agent interactions
- `payments` - Financial transactions
- `enrollments` - Course registrations

#### 3. Integration Points
- **ElevenLabs Webhook**: Receives call data at `/api/webhooks/elevenlabs-call`
- **MCP Server**: Query tools at `/api/mcp/execute?tool_name=X`
- **n8n Direct**: Chat histories at `/api/n8n/chat-histories`

### Progress Verification Methods

#### 1. Visual Verification
- Home page dashboard shows real-time stats
- Analytics page displays business metrics
- Lead management page lists all leads
- Check for proper cyberpunk styling

#### 2. API Testing
```bash
# Test lead retrieval
curl http://localhost:5000/api/leads

# Test analytics
curl http://localhost:5000/api/analytics

# Test MCP health
curl http://localhost:5000/api/mcp/health
```

#### 3. Database Verification
- Check lead count matches dashboard
- Verify enrollment statuses are accurate
- Confirm payment records are complete

### Common Tasks and Commands

#### Adding New Features
1. **Frontend Component**: Add to `/client/src/components/`
2. **New Page**: Create in `/client/src/pages/` and register in App.tsx
3. **API Endpoint**: Add to `/server/routes.ts`
4. **Database Schema**: Modify `/shared/schema.ts` then run `npm run db:push`

#### Debugging Issues
1. **Check Logs**: Review workflow console for errors
2. **API Errors**: Look for 4xx/5xx status codes
3. **Frontend Errors**: Check browser console logs
4. **Database Issues**: Use execute_sql_tool for queries

### System Constraints and Limitations

#### Technical Constraints
- Port 5000 is the only exposed port
- Database access limited to development environment
- Cannot modify production database directly
- File uploads must go through proper channels

#### Integration Limitations
- ElevenLabs webhook requires proper authentication
- MCP bearer token: `Ry27942001$`
- n8n integration requires keep-alive mechanism
- Payment processing (Stripe) not yet implemented

### Reporting Structure

When reporting to human users about Replit Agent's work:

#### Include:
1. **Completed Tasks**: List what was accomplished
2. **Current State**: Describe what's working
3. **Pending Items**: What still needs to be done
4. **Blockers**: Any issues preventing progress
5. **Next Steps**: Recommended actions

#### Example Report Format:
```
Progress Update:

✓ Completed:
- Implemented lead filtering by status
- Added real-time analytics refresh
- Fixed MCP endpoint authentication

✓ Working:
- All API endpoints responding
- Dashboard showing live data
- Voice agent webhook processing calls

⟶ In Progress:
- Payment integration with Stripe
- Email notification system

⚠ Blockers:
- Need Stripe API key for payment processing
- Awaiting SMS provider selection

→ Next Steps:
- Test the new lead filtering feature
- Provide API keys for external services
```

### Error Handling Guidelines

#### Common Issues and Solutions:

1. **Database Connection Error**
   - Check DATABASE_URL environment variable
   - Verify PostgreSQL is running
   - Test with simple query

2. **API 404 Errors**
   - Verify endpoint exists in routes.ts
   - Check URL path spelling
   - Ensure server is running

3. **Frontend Not Loading**
   - Check Vite server status
   - Clear browser cache
   - Verify port 5000 accessibility

4. **MCP Authentication Failed**
   - Verify bearer token is correct
   - Check authorization header format
   - Review CORS settings

### Best Practices for Collaboration

1. **Clear Communication**
   - Be specific about what to test
   - Provide exact error messages
   - Include timestamps for issues

2. **Incremental Changes**
   - Request one feature at a time
   - Test after each modification
   - Document changes made

3. **Data Integrity**
   - Never delete production data
   - Use transactions for critical operations
   - Maintain audit trails

4. **Security Awareness**
   - Keep API keys secure
   - Don't expose sensitive endpoints
   - Validate all user inputs

### Quick Troubleshooting Checklist

- [ ] Application running on port 5000?
- [ ] Database connected (check with `/api/analytics`)?
- [ ] All environment variables set?
- [ ] No TypeScript errors in console?
- [ ] API endpoints returning data?
- [ ] Frontend routing working?
- [ ] WebSocket connections stable?
- [ ] Authentication working properly?

This guide should help external LLMs effectively communicate with human users about the Replit Agent's work and accurately report on system status and progress.