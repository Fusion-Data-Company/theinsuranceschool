import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import type { Lead, Enrollment } from '@shared/schema';

export interface EnrollmentDocuments {
  welcomePacket: Buffer;
  paymentReceipt: Buffer;
  courseInstructions: Buffer;
}

export class DocumentGenerationService {
  
  /**
   * Generate complete enrollment package for a paid student
   */
  async generateEnrollmentPackage(lead: Lead, enrollment?: Enrollment): Promise<EnrollmentDocuments> {
    const [welcomePacket, paymentReceipt, courseInstructions] = await Promise.all([
      this.generateWelcomePacket(lead, enrollment),
      this.generatePaymentReceipt(lead),
      this.generateCourseInstructions(lead, enrollment)
    ]);

    return {
      welcomePacket,
      paymentReceipt,
      courseInstructions
    };
  }

  /**
   * Generate professional welcome packet and enrollment confirmation
   */
  private async generateWelcomePacket(lead: Lead, enrollment?: Enrollment): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Standard letter size
    const { width, height } = page.getSize();
    
    // Load fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Header with company branding
    page.drawText('INSURANCE LICENSING EDUCATION', {
      x: 50,
      y: height - 80,
      size: 20,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.4), // Dark blue
    });
    
    page.drawText('Welcome to Your Licensing Journey', {
      x: 50,
      y: height - 110,
      size: 16,
      font: boldFont,
      color: rgb(0.8, 0, 0.8), // Purple accent
    });

    // Student Information
    let yPosition = height - 160;
    
    page.drawText(`Dear ${lead.firstName} ${lead.lastName},`, {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
    });
    
    yPosition -= 30;
    page.drawText('Congratulations! Your enrollment has been confirmed for:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    yPosition -= 25;
    page.drawText(`• License Type: ${this.getLicenseFullName(lead.licenseGoal)}`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    yPosition -= 20;
    page.drawText(`• Payment Status: ${lead.paymentStatus}`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    if (lead.confirmationNumber) {
      yPosition -= 20;
      page.drawText(`• Confirmation #: ${lead.confirmationNumber}`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: regularFont,
      });
    }

    if (enrollment) {
      yPosition -= 20;
      page.drawText(`• Cohort: ${enrollment.cohort}`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: regularFont,
      });
      
      yPosition -= 20;
      page.drawText(`• Start Date: ${new Date(enrollment.startDate).toLocaleDateString()}`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: regularFont,
      });
    }

    // Next Steps Section
    yPosition -= 40;
    page.drawText('NEXT STEPS:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.8, 0, 0.8),
    });
    
    const nextSteps = [
      '1. Check your email for course access credentials',
      '2. Review the attached Course Instructions document',
      '3. Join your cohort group (details in Course Instructions)',
      '4. Complete pre-course assessment within 48 hours',
      '5. Contact your supervisor for any questions'
    ];
    
    nextSteps.forEach(step => {
      yPosition -= 25;
      page.drawText(step, {
        x: 70,
        y: yPosition,
        size: 11,
        font: regularFont,
      });
    });

    // Contact Information
    yPosition -= 50;
    page.drawText('SUPPORT CONTACT:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.8, 0, 0.8),
    });
    
    yPosition -= 25;
    page.drawText(`Supervisor: ${lead.supervisor || 'Kelli Kirk'}`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    yPosition -= 20;
    page.drawText('Email: support@insurancelicensingeducation.com', {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });

    // Footer
    page.drawText(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, {
      x: 50,
      y: 50,
      size: 10,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    return Buffer.from(await pdfDoc.save());
  }

  /**
   * Generate professional payment receipt
   */
  private async generatePaymentReceipt(lead: Lead): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();
    
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Header
    page.drawText('PAYMENT RECEIPT', {
      x: 50,
      y: height - 80,
      size: 20,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.4),
    });
    
    let yPosition = height - 140;
    
    // Receipt details
    page.drawText(`Receipt Date: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    yPosition -= 30;
    page.drawText('STUDENT INFORMATION:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
    });
    
    yPosition -= 25;
    page.drawText(`Name: ${lead.firstName} ${lead.lastName}`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    yPosition -= 20;
    page.drawText(`Email: ${lead.email}`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    yPosition -= 20;
    page.drawText(`Phone: ${lead.phone}`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });

    // Payment Information
    yPosition -= 40;
    page.drawText('PAYMENT INFORMATION:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
    });
    
    yPosition -= 25;
    page.drawText(`Course: ${this.getLicenseFullName(lead.licenseGoal)} License Education`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    yPosition -= 20;
    page.drawText(`Payment Method: ${lead.paymentPreference || 'Credit Card'}`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    yPosition -= 20;
    page.drawText(`Status: ${lead.paymentStatus}`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: rgb(0, 0.6, 0), // Green for paid
    });
    
    if (lead.confirmationNumber) {
      yPosition -= 20;
      page.drawText(`Confirmation Number: ${lead.confirmationNumber}`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0.8, 0, 0.8),
      });
    }

    // Amount (placeholder - you might want to add amount field to Lead schema)
    yPosition -= 30;
    page.drawText('Amount: $299.00', {
      x: 70,
      y: yPosition,
      size: 14,
      font: boldFont,
    });

    return Buffer.from(await pdfDoc.save());
  }

  /**
   * Generate course access and instructions document
   */
  private async generateCourseInstructions(lead: Lead, enrollment?: Enrollment): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();
    
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Header
    page.drawText('COURSE ACCESS INSTRUCTIONS', {
      x: 50,
      y: height - 80,
      size: 18,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.4),
    });
    
    let yPosition = height - 130;
    
    page.drawText(`Welcome ${lead.firstName}!`, {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
    });
    
    yPosition -= 30;
    page.drawText('Your course login credentials and instructions:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: regularFont,
    });

    // Login Information
    yPosition -= 40;
    page.drawText('PLATFORM ACCESS:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.8, 0, 0.8),
    });
    
    yPosition -= 25;
    page.drawText('Website: https://learn.insurancelicensingeducation.com', {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    yPosition -= 20;
    page.drawText(`Username: ${lead.email}`, {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });
    
    yPosition -= 20;
    page.drawText('Password: (sent separately via SMS for security)', {
      x: 70,
      y: yPosition,
      size: 12,
      font: regularFont,
    });

    // Course Schedule
    if (enrollment) {
      yPosition -= 40;
      page.drawText('YOUR COHORT SCHEDULE:', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0.8, 0, 0.8),
      });
      
      yPosition -= 25;
      page.drawText(`Cohort: ${enrollment.cohort} Group`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: regularFont,
      });
      
      yPosition -= 20;
      page.drawText(`Start Date: ${new Date(enrollment.startDate).toLocaleDateString()}`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: regularFont,
      });
    }

    // Important Instructions
    yPosition -= 40;
    page.drawText('IMPORTANT INSTRUCTIONS:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.8, 0, 0.8),
    });
    
    const instructions = [
      '• Log in within 24 hours to activate your account',
      '• Complete the pre-assessment to gauge your knowledge',
      '• Join live sessions or access recorded content',
      '• Track your progress through the dashboard',
      '• Contact support if you encounter any technical issues'
    ];
    
    instructions.forEach(instruction => {
      yPosition -= 25;
      page.drawText(instruction, {
        x: 70,
        y: yPosition,
        size: 11,
        font: regularFont,
      });
    });

    return Buffer.from(await pdfDoc.save());
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

export const documentService = new DocumentGenerationService();