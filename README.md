# Tutoring for STEM

Angular version of the original existentialThinkerWebsite. The original services, recent topics, contact fields, navigation, and green layout are preserved. Original HTML/CSS/script source is retained in `legacy-static/` as reference; it is not loaded by the application.

## Run locally

Use Node 26.10.0 (or an Angular 22 supported Node release).

```sh
npm ci
npm start
```

Open http://127.0.0.1:4200. Keep the terminal in the foreground; stop with Ctrl+C.

```sh
npm run build
npm run typecheck
npm test -- --browsers=ChromeHeadless
npm audit
```

## Contact email

Email is disabled by default and unavailable offline. The form validates required name, email and message; it never claims an email was sent when no service is configured. Message fields are preserved on failure. For optional online email, configure `src/email-config.ts` with your own EmailJS **public** key, service ID and template ID and set enabled to true. Use template variables `name`, `email`, `message`. Never embed private keys. Real email delivery was not exercised during migration; tests mock the optional service and make no external calls.

The original domain files `CNAME` and `surge.json` are retained; no deployment or DNS changes were performed. Production output is `dist/existential-thinker-website/browser`.

## Compatibility

Angular 22.2.0, Node 26.10.0, TypeScript 6.0.3, EmailJS browser SDK 4.4.1. TypeScript stays below 6.1 as required by Angular 22. Jasmine 6.3 / types 6 are held for Zone 0.16 test compatibility; newer Jasmine read-only globals conflict with Zone. Official references: [Angular versions](https://angular.dev/reference/versions), [EmailJS sendForm](https://www.emailjs.com/docs/sdk/send-form/).
