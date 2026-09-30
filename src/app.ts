import { Component, ChangeDetectionStrategy } from '@angular/core';
import emailjs from '@emailjs/browser';
import { emailConfig } from './email-config';

@Component({selector:'app-root', standalone:true, templateUrl:'./app.html', changeDetection:ChangeDetectionStrategy.Eager})
export class TutoringApp {
  sending = false;
  status = 'Email is unavailable offline and until an online email service is configured.';
  async submit(event: Event, form: HTMLFormElement): Promise<void> {
    event.preventDefault();
    if (this.sending || !form.reportValidity()) return;
    if (!navigator.onLine) { this.status = 'Email is unavailable offline. Your message has not been sent.'; return; }
    if (!emailConfig.enabled || !emailConfig.serviceId || !emailConfig.templateId || !emailConfig.publicKey) {
      this.status = 'Email service is not configured. Your message has not been sent.'; return;
    }
    this.sending = true;
    this.status = 'Sending…';
    try {
      await emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, form, { publicKey: emailConfig.publicKey });
      this.status = 'Email sent successfully!';
      form.reset();
    } catch { this.status = 'Email could not be sent. Please try again when the online service is available.'; }
    finally { this.sending = false; }
  }
}
