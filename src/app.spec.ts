import { TestBed } from '@angular/core/testing';
import { TutoringApp } from './app';
import { emailConfig } from './email-config';
import emailjs from '@emailjs/browser';

describe('Tutoring website', () => {
  afterEach(() => { emailConfig.enabled=false; emailConfig.serviceId=''; emailConfig.templateId=''; emailConfig.publicKey=''; });
  async function fixture() { await TestBed.configureTestingModule({imports:[TutoringApp]}).compileComponents(); const f=TestBed.createComponent(TutoringApp);f.detectChanges();return f; }
  it('preserves sections, services, topics and required contact fields', async () => {
    const f=await fixture();const el=f.nativeElement;
    expect(el.querySelector('h1').textContent).toBe('Tutoring for STEM');
    expect(el.querySelectorAll('.service').length).toBe(3);expect(el.querySelectorAll('.project').length).toBe(3);
    expect(el.querySelectorAll('form [required]').length).toBe(3);
    for(const id of ['services','projects','contact']) expect(el.querySelector('#'+id)).toBeTruthy();
  });
  it('does not call email when offline or unconfigured', async () => {
    const f=await fixture();const send=spyOn(emailjs,'sendForm');const form=f.nativeElement.querySelector('form');spyOn(form,'reportValidity').and.returnValue(true);
    spyOnProperty(navigator,'onLine','get').and.returnValue(false);
    await f.componentInstance.submit(new Event('submit'),form);expect(f.componentInstance.status).toContain('offline');expect(send).not.toHaveBeenCalled();
  });
  it('does not call an unconfigured online service', async () => {
    const f=await fixture();const send=spyOn(emailjs,'sendForm');const form=f.nativeElement.querySelector('form');spyOn(form,'reportValidity').and.returnValue(true);spyOnProperty(navigator,'onLine','get').and.returnValue(true);
    await f.componentInstance.submit(new Event('submit'),form);expect(f.componentInstance.status).toContain('not configured');expect(send).not.toHaveBeenCalled();
  });
  it('validates before sending and preserves message on service failure', async () => {
    const f=await fixture();const form=f.nativeElement.querySelector('form');const valid=spyOn(form,'reportValidity').and.returnValue(false);const send=spyOn(emailjs,'sendForm').and.rejectWith(new Error('offline'));spyOnProperty(navigator,'onLine','get').and.returnValue(true);
    emailConfig.enabled=true;emailConfig.serviceId='test';emailConfig.templateId='test';emailConfig.publicKey='test';
    await f.componentInstance.submit(new Event('submit'),form);expect(send).not.toHaveBeenCalled();valid.and.returnValue(true);form.querySelector('textarea').value='Keep this message';
    await f.componentInstance.submit(new Event('submit'),form);expect(f.componentInstance.status).toContain('could not');expect(form.querySelector('textarea').value).toBe('Keep this message');expect(f.componentInstance.sending).toBeFalse();
  });
  it('clears the form only after a successful online send', async () => {
    const f=await fixture();const form=f.nativeElement.querySelector('form');spyOn(form,'reportValidity').and.returnValue(true);spyOnProperty(navigator,'onLine','get').and.returnValue(true);spyOn(emailjs,'sendForm').and.resolveTo({status:200,text:'OK'});
    emailConfig.enabled=true;emailConfig.serviceId='test';emailConfig.templateId='test';emailConfig.publicKey='test';form.querySelector('textarea').value='Test';
    await f.componentInstance.submit(new Event('submit'),form);expect(f.componentInstance.status).toContain('successfully');expect(form.querySelector('textarea').value).toBe('');
  });
});
