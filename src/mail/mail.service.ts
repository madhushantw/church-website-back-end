import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter!: Transporter;

  async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection successful.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`SMTP verification failed: ${message}`);
      throw error;
    }
  }

  onModuleInit() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 465);
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;

    if (!host || !port || !user || !password) {
      throw new Error(
        'Missing SMTP configuration. Check SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass: password,
      },
    });
  }

  async sendPasswordResetOtp(email: string, otp: string): Promise<void> {
    await this.verifyConnection();

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Password Reset Code',
        text: [
          `Your password reset code is: ${otp}`,
          'This code expires in 10 minutes.',
          'If you did not request this, you can ignore this email.',
        ].join('\n\n'),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 24px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #3a6b73;">Password Reset</h2>
            <p>Use the code below to reset your password.</p>
            <div style="margin: 24px 0; padding: 18px; background: #f5f0e8; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
              ${otp}
            </div>
            <p>This code expires in <strong>10 minutes</strong>.</p>
            <p style="color: #666; font-size: 13px;">
              If you did not request this, you can safely ignore this email.
            </p>
          </div>
        `,
      });

      this.logger.log('Password reset email sent.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`Failed to send password reset email: ${message}`);

      throw new InternalServerErrorException(
        'Unable to send the reset email. Please try again.',
      );
    }
  }
}
