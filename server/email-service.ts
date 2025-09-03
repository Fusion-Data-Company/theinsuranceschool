import nodemailer from 'nodemailer';
import type { Lead, Enrollment } from '@shared/schema';
import { documentService, type EnrollmentDocuments } from './document-service';

export interface EmailConfig {
  from: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  
  constructor(config?: EmailConfig) {
    // Use environment variables or provided config
    const emailConfig = config || {
      from: process.env.EMAIL_FROM || 'no-reply@insurancelicensingeducation.com',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: parseInt(process.env.SMTP_PORT || '587'),
      smtpUser: process.env.SMTP_USER || '',
      smtpPassword: process.env.SMTP_PASSWORD || ''
    };

    this.transporter = nodemailer.createTransport({
      host: emailConfig.smtpHost,
      port: emailConfig.smtpPort,
      secure: emailConfig.smtpPort === 465, // true for 465, false for other ports
      auth: emailConfig.smtpUser && emailConfig.smtpPassword ? {
        user: emailConfig.smtpUser,
        pass: emailConfig.smtpPassword,
      } : undefined,
    });
  }

  /**
   * Send complete enrollment package to student
   */
  async sendEnrollmentPackage(lead: Lead, enrollment?: Enrollment): Promise<boolean> {
    try {
      console.log(`Generating enrollment documents for ${lead.firstName} ${lead.lastName}...`);
      
      // Generate all documents
      const documents = await documentService.generateEnrollmentPackage(lead, enrollment);
      
      // Create email content
      const subject = `🎉 Welcome to Insurance Licensing Education - ${this.getLicenseFullName(lead.licenseGoal)}`;
      
      const htmlContent = this.createEnrollmentEmailTemplate(lead, enrollment);
      const textContent = this.createEnrollmentEmailText(lead, enrollment);
      
      // Prepare attachments
      const attachments = [
        {
          filename: `Welcome-Package-${lead.firstName}_${lead.lastName}.pdf`,
          content: documents.welcomePacket,
          contentType: 'application/pdf'
        },
        {
          filename: `Payment-Receipt-${lead.confirmationNumber || Date.now()}.pdf`,
          content: documents.paymentReceipt,
          contentType: 'application/pdf'
        },
        {
          filename: `Course-Instructions-${lead.licenseGoal}.pdf`,
          content: documents.courseInstructions,
          contentType: 'application/pdf'
        }
      ];

      // Send email
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Insurance Licensing Education <no-reply@insurancelicensingeducation.com>',
        to: lead.email,
        cc: process.env.SUPERVISOR_EMAIL || 'supervisor@insurancelicensingeducation.com',
        subject,
        text: textContent,
        html: htmlContent,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`Enrollment package sent successfully to ${lead.email}: ${result.messageId}`);
      return true;
      
    } catch (error) {
      console.error('Failed to send enrollment package:', error);
      return false;
    }
  }

  /**
   * Send payment confirmation email (lighter version for quick confirmations)
   */
  async sendPaymentConfirmation(lead: Lead): Promise<boolean> {
    try {
      const subject = `Payment Confirmed - ${this.getLicenseFullName(lead.licenseGoal)} Course`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Payment Confirmed!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hi ${lead.firstName}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Great news! Your payment has been successfully processed for the 
              <strong>${this.getLicenseFullName(lead.licenseGoal)}</strong> course.
            </p>
            
            ${lead.confirmationNumber ? `
              <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
                <strong>Confirmation Number:</strong> ${lead.confirmationNumber}
              </div>
            ` : ''}
            
            <h3 style="color: #667eea;">What's Next?</h3>
            <ul style="font-size: 14px; line-height: 1.8;">
              <li>Your complete enrollment package will arrive within 15 minutes</li>
              <li>Check your email for course access credentials</li>
              <li>Complete your profile setup on our learning platform</li>
              <li>Join your assigned cohort group</li>
            </ul>
            
            <div style="margin-top: 30px; padding: 15px; background: white; border-radius: 5px;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                Questions? Contact your supervisor <strong>${lead.supervisor || 'Kelli Kirk'}</strong> 
                or email support@insurancelicensingeducation.com
              </p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #333; color: white; font-size: 12px;">
            Insurance Licensing Education © ${new Date().getFullYear()}
          </div>
        </div>
      `;

      const textContent = `
Payment Confirmed - ${this.getLicenseFullName(lead.licenseGoal)} Course

Hi ${lead.firstName}!

Great news! Your payment has been successfully processed for the ${this.getLicenseFullName(lead.licenseGoal)} course.

${lead.confirmationNumber ? `Confirmation Number: ${lead.confirmationNumber}` : ''}

What's Next?
• Your complete enrollment package will arrive within 15 minutes
• Check your email for course access credentials  
• Complete your profile setup on our learning platform
• Join your assigned cohort group

Questions? Contact your supervisor ${lead.supervisor || 'Kelli Kirk'} or email support@insurancelicensingeducation.com

Insurance Licensing Education © ${new Date().getFullYear()}
      `;

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Insurance Licensing Education <no-reply@insurancelicensingeducation.com>',
        to: lead.email,
        subject,
        text: textContent,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Payment confirmation sent to ${lead.email}: ${result.messageId}`);
      return true;
      
    } catch (error) {
      console.error('Failed to send payment confirmation:', error);
      return false;
    }
  }

  /**
   * Create rich HTML email template for enrollment package
   */
  private createEnrollmentEmailTemplate(lead: Lead, enrollment?: Enrollment): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Your Journey!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Insurance Licensing Education</p>
        </div>
        
        <div style="padding: 40px 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${lead.firstName}! 🎉</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Congratulations! Your enrollment for the <strong>${this.getLicenseFullName(lead.licenseGoal)}</strong> 
            program has been confirmed and your journey to becoming a licensed insurance professional starts now!
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #667eea;">📋 Your Enrollment Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 5px 0;"><strong>License Type:</strong> ${this.getLicenseFullName(lead.licenseGoal)}</li>
              <li style="padding: 5px 0;"><strong>Payment Status:</strong> ✅ ${lead.paymentStatus}</li>
              ${lead.confirmationNumber ? `<li style="padding: 5px 0;"><strong>Confirmation #:</strong> ${lead.confirmationNumber}</li>` : ''}
              ${enrollment ? `<li style="padding: 5px 0;"><strong>Cohort:</strong> ${enrollment.cohort} Group</li>` : ''}
              ${enrollment ? `<li style="padding: 5px 0;"><strong>Start Date:</strong> ${new Date(enrollment.startDate).toLocaleDateString()}</li>` : ''}
            </ul>
          </div>
          
          <div style="background: #e8f2ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #1a73e8;">📎 Documents Attached</h3>
            <p style="margin-bottom: 15px;">We've attached your complete enrollment package:</p>
            <ul style="margin: 0;">
              <li><strong>Welcome Package</strong> - Your complete enrollment confirmation</li>
              <li><strong>Payment Receipt</strong> - Official payment confirmation</li>
              <li><strong>Course Instructions</strong> - Platform access and getting started guide</li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7;">
            <h3 style="margin-top: 0; color: #856404;">🚀 Next Steps (Important!)</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li style="padding: 8px 0;">Review the attached Course Instructions document</li>
              <li style="padding: 8px 0;">Log into the learning platform within 24 hours</li>
              <li style="padding: 8px 0;">Complete your student profile and pre-assessment</li>
              <li style="padding: 8px 0;">Join your cohort group chat/forum</li>
              <li style="padding: 8px 0;">Mark your calendar for live sessions</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://learn.insurancelicensingeducation.com" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Access Learning Platform →
            </a>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #667eea;">📞 Need Help?</h3>
            <p style="margin-bottom: 10px;"><strong>Your Supervisor:</strong> ${lead.supervisor || 'Kelli Kirk'}</p>
            <p style="margin-bottom: 10px;"><strong>Email Support:</strong> support@insurancelicensingeducation.com</p>
            <p style="margin: 0;"><strong>Phone Support:</strong> 1-800-LICENSE (1-800-542-3673)</p>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              We're excited to have you in our program! Your success is our priority.
            </p>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; background: #333; color: white;">
          <p style="margin: 0; font-size: 12px;">
            Insurance Licensing Education © ${new Date().getFullYear()} | 
            <a href="#" style="color: #ccc;">Unsubscribe</a> | 
            <a href="#" style="color: #ccc;">Privacy Policy</a>
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Create plain text version of enrollment email
   */
  private createEnrollmentEmailText(lead: Lead, enrollment?: Enrollment): string {
    return `
WELCOME TO INSURANCE LICENSING EDUCATION

Hi ${lead.firstName}!

Congratulations! Your enrollment for the ${this.getLicenseFullName(lead.licenseGoal)} program has been confirmed.

ENROLLMENT DETAILS:
• License Type: ${this.getLicenseFullName(lead.licenseGoal)}
• Payment Status: ${lead.paymentStatus}
${lead.confirmationNumber ? `• Confirmation #: ${lead.confirmationNumber}` : ''}
${enrollment ? `• Cohort: ${enrollment.cohort} Group` : ''}
${enrollment ? `• Start Date: ${new Date(enrollment.startDate).toLocaleDateString()}` : ''}

ATTACHED DOCUMENTS:
• Welcome Package - Complete enrollment confirmation
• Payment Receipt - Official payment confirmation  
• Course Instructions - Platform access and getting started guide

NEXT STEPS:
1. Review the attached Course Instructions document
2. Log into the learning platform within 24 hours
3. Complete your student profile and pre-assessment
4. Join your cohort group chat/forum
5. Mark your calendar for live sessions

PLATFORM ACCESS:
https://learn.insurancelicensingeducation.com

SUPPORT:
Supervisor: ${lead.supervisor || 'Kelli Kirk'}
Email: support@insurancelicensingeducation.com
Phone: 1-800-LICENSE (1-800-542-3673)

We're excited to have you in our program!

Insurance Licensing Education © ${new Date().getFullYear()}
    `;
  }

  /**
   * Convert license code to full name
   */
  private getLicenseFullName(licenseGoal: string): string {
    switch (licenseGoal) {
      case '2-15':
        return 'Life & Health Insurance';
      case '2-40':
        return 'Property & Casualty Insurance';
      case '2-14':
        return 'Personal Lines Insurance';
      default:
        return 'Insurance License';
    }
  }
}

export const emailService = new EmailService();