# SMS Integration Guide for Insurance School CRM

## Overview
Complete SMS notification system using Twilio second account credentials for automated lead notifications.

## SMS Flow Architecture
```
ElevenLabs Voice Agent → Webhook → CRM Database → SMS Notification → Supervisor Phone
                    ↓
            n8n Workflow Processor → Enhanced Lead Data → Twilio SMS → +14074013100
```

## Twilio Configuration

### Account Details
- **From Phone**: +16894076645 (TWILIO_PHONE_NUMBER_2)
- **To Phone**: +14074013100 (Fixed recipient for all notifications)
- **Account SID**: TWILIO_ACCOUNT_SID_2 
- **Auth Token**: TWILIO_AUTH_TOKEN_2

### Message Templates

#### PAID Lead Notification
```
💰 NEW ENROLLMENT! [Name] just paid for [License] license. Payment confirmed: [ConfirmationNumber]
```

#### NOT_PAID Lead Notification  
```
🎯 HOT LEAD: [Name] wants [License] license. [UrgencyLevel] to start. Needs follow-up!
```

## API Endpoints

### 1. ElevenLabs Webhook (Enhanced)
**Endpoint**: `POST /api/webhooks/elevenlabs-call`
- Processes voice agent data
- Creates/updates lead records
- Triggers SMS based on payment status
- Auto-sends notification to +14074013100

### 2. n8n Workflow Webhook
**Endpoint**: `POST /api/webhooks/n8n-lead-processor`
- Handles enhanced lead data with all 12 fields
- Supports both snake_case and camelCase field names
- Immediate SMS notification upon processing
- Returns comprehensive lead data for workflow use

**Sample Request**:
```json
{
  "firstName": "John",
  "lastName": "Smith", 
  "phone": "+15551234567",
  "email": "john@example.com",
  "licenseGoal": "2-15",
  "painPoints": "Need extra income for family",
  "employmentStatus": "Part-time retail",
  "urgencyLevel": "High - needs income boost ASAP",
  "paymentPreference": "Payment plan",
  "paymentStatus": "NOT_PAID",
  "agentName": "Bandit AI",
  "supervisor": "Kelli Kirk",
  "leadSource": "ElevenLabs Voice Agent",
  "callSummary": "Interested in license, wants payment plan",
  "conversationId": "conv_123"
}
```

### 3. SMS Test Endpoint
**Endpoint**: `POST /api/test-sms`
- Sends test message to verify Twilio integration
- Uses hardcoded test lead data
- Returns success/failure status

## Enhanced Lead Fields

The system now captures 12 additional fields from voice conversations:

1. **painPoints** - Customer's financial/career pain points
2. **employmentStatus** - Current employment situation  
3. **urgencyLevel** - How quickly they need to start earning
4. **paymentPreference** - Preferred payment method/plan
5. **paymentStatus** - PAID or NOT_PAID status
6. **confirmationNumber** - Payment confirmation when paid
7. **agentName** - Voice agent that handled the call
8. **supervisor** - Assigned supervisor (default: Kelli Kirk)
9. **leadSource** - Source of the lead
10. **callSummary** - Summary of conversation
11. **callDate** - When the call occurred
12. **conversationId** - Unique conversation identifier

## n8n Workflow Integration

### Recommended n8n Workflow Steps:

1. **Webhook Trigger Node**
   - URL: `https://your-replit-url.replit.app/api/webhooks/n8n-lead-processor`
   - Method: POST
   - Authentication: None required

2. **Data Processing Node**
   - Transform ElevenLabs data to CRM format
   - Map conversation insights to lead fields
   - Set payment status based on conversation outcome

3. **HTTP Request Node** 
   - Send formatted data to webhook endpoint
   - Receive lead creation confirmation
   - Handle success/error responses

4. **Conditional Logic Node**
   - Branch based on payment status
   - Route PAID leads to enrollment workflow
   - Route NOT_PAID leads to follow-up sequence

## Testing & Verification

### Manual SMS Test
```bash
curl -X POST "https://your-app.replit.app/api/test-sms" \
  -H "Content-Type: application/json"
```

### Lead Processing Test
```bash
curl -X POST "https://your-app.replit.app/api/webhooks/n8n-lead-processor" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","phone":"+15551234567",...}'
```

### Expected SMS Delivery
- Messages sent from: +16894076645
- Messages received at: +14074013100  
- Delivery time: Usually within 5-15 seconds
- Format: Unicode emoji + structured message

## Error Handling

### SMS Failures
- SMS failures do not block webhook processing
- Errors logged to console for monitoring
- Webhook returns success even if SMS fails
- Manual retry available via test endpoint

### Lead Processing Failures
- Validation errors return 400 status
- Database errors return 500 status
- Duplicate phone numbers update existing records
- All webhook calls logged for audit trail

## Production Deployment

### Environment Variables Required
```
TWILIO_ACCOUNT_SID_2=AC205e21dd5827079bf4791a80a4d05ea1
TWILIO_AUTH_TOKEN_2=4f6a234161d8184588e06a62f115332b  
TWILIO_PHONE_NUMBER_2=+16894076645
```

### Monitoring Checklist
- [ ] SMS delivery rates tracked
- [ ] Webhook response times monitored  
- [ ] Error rates below 1%
- [ ] Lead data completeness verified
- [ ] n8n workflow automation active

## Advanced Features

### Future Enhancement Options
1. **Dynamic Recipients** - Multiple supervisor phone numbers
2. **Message Customization** - Per-license-type message templates
3. **Delivery Tracking** - SMS delivery status webhooks
4. **Rate Limiting** - Prevent SMS spam/flooding
5. **Rich Messaging** - MMS with lead attachments

The SMS integration is now fully operational and ready for production use with your ElevenLabs voice agents and n8n workflow automation.