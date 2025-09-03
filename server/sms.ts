import twilio from 'twilio';
import type { Lead } from '@shared/schema';

// Initialize Twilio client with second account credentials
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID_2,
  process.env.TWILIO_AUTH_TOKEN_2
);

const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER_2; // +16894076645
const TO_PHONE = '+14074013100'; // Where notifications go

interface SMSNotificationData {
  lead: Lead;
  type: 'PAID' | 'NOT_PAID';
}

export async function sendLeadNotification(data: SMSNotificationData): Promise<boolean> {
  try {
    const { lead, type } = data;
    const fullName = `${lead.firstName} ${lead.lastName}`;
    
    let message: string;
    
    if (type === 'PAID') {
      message = `💰 NEW ENROLLMENT! ${fullName} just paid for ${lead.licenseGoal} license. Payment confirmed: ${lead.confirmationNumber || 'Pending'}`;
    } else {
      message = `🎯 HOT LEAD: ${fullName} wants ${lead.licenseGoal} license. ${lead.urgencyLevel || 'Timeline unknown'} to start. Needs follow-up!`;
    }
    
    const result = await twilioClient.messages.create({
      body: message,
      from: FROM_PHONE,
      to: TO_PHONE,
    });
    
    console.log(`SMS sent successfully: ${result.sid}`);
    return true;
    
  } catch (error) {
    console.error('Failed to send SMS notification:', error);
    return false;
  }
}

// Personal test function - sends SMS to specific number for verification
export async function sendPersonalTestSMS(toNumber: string): Promise<boolean> {
  try {
    const message = `🧪 Insurance School CRM SMS Test - Your SMS integration is working perfectly! From your Bandit AI system. ${new Date().toLocaleTimeString()}`;
    
    const result = await twilioClient.messages.create({
      body: message,
      from: FROM_PHONE, // +16894076645
      to: toNumber,
    });
    
    console.log(`Personal test SMS sent successfully to ${toNumber}: ${result.sid}`);
    return true;
    
  } catch (error) {
    console.error(`Failed to send personal test SMS to ${toNumber}:`, error);
    return false;
  }
}

// Test function for manual SMS testing
export async function testSMSNotification(): Promise<boolean> {
  const testLead: Lead = {
    id: 999,
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890',
    email: 'test@example.com',
    licenseGoal: '2-15',
    source: 'voice_agent',
    status: 'new',
    painPoints: null,
    employmentStatus: null,
    urgencyLevel: 'High - needs income boost ASAP',
    paymentPreference: null,
    paymentStatus: 'NOT_PAID',
    confirmationNumber: null,
    agentName: 'Jennifer AI',
    supervisor: 'Kelli Kirk',
    leadSource: 'ElevenLabs Voice Agent',
    callSummary: null,
    callDate: null,
    conversationId: null,
    unansweredCallAttempts: 0,
    lastCallAttemptAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  return await sendLeadNotification({
    lead: testLead,
    type: 'NOT_PAID'
  });
}