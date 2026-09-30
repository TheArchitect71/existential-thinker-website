import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';
import { TutoringApp } from './app';
bootstrapApplication(TutoringApp, {providers:[provideZoneChangeDetection()]}).catch(console.error);
