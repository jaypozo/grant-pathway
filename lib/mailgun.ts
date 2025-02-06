import formData from 'form-data';
import Mailgun from 'mailgun.js';

if (!process.env.MAILGUN_API_KEY) {
  throw new Error('MAILGUN_API_KEY is required');
}

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  url: 'https://api.mailgun.net', // or your region-specific endpoint
});

const DOMAIN = 'mg.grantpathway.com'; // replace with your Mailgun domain

interface SendTemplateEmailParams {
  to: string;
  subject: string;
  template: string;
  variables: Record<string, string>;
}

export async function sendTemplateEmail({ to, subject, template, variables }: SendTemplateEmailParams) {
  try {
    const msg = await mg.messages.create(DOMAIN, {
      from: 'Grant Pathway <postmaster@mg.grantpathway.com>',
      to: [to],
      subject,
      template,
      'h:X-Mailgun-Variables': JSON.stringify(variables),
    });
    
    return { success: true, id: msg.id };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 