# RabTech Academy Student Portal - Accessibility & Architecture Audit

This repository contains the accessibility baseline, performance audit, and monorepo project architecture for the RabTech Academy student platform reverse-engineering task (Task 02).

## 📊 Lighthouse Audit Summary
* **Performance:** 74 / 100
* **Accessibility:** 90 / 100
* **Best Practices:** 96 / 100
* **SEO:** 58 / 100

---

## 🔍 Key Issues Identified & Remediation Priority

1. **Low Color Contrast (Accessibility - Medium Priority):**
   * *Issue:* `<span class="task-marker">` elements fail contrast ratios.
   * *Fix:* Update CSS foreground/background hex values for better readability.
2. **Unoptimized Logo Image (Performance - High Priority):**
   * *Issue:* `/RabtechLogo.png` is oversized (214 KiB) for its small display dimensions.
   * *Fix:* Compress image, serve in WebP format, and implement responsive sizing.
3. **Render-Blocking CSS (Performance - High Priority):**
   * *Issue:* Multiple stylesheets block initial page rendering.
   * *Fix:* Inline critical CSS and defer non-critical style files.
4. **Missing Content Security Policy (Best Practices - High Priority):**
   * *Issue:* No CSP or HSTS headers found in enforcement mode.
   * *Fix:* Configure server security headers in production.
5. **Missing Meta Description (SEO - Medium Priority):**
   * *Issue:* Document lacks a meta description tag.
   * *Fix:* Add `<meta name="description" content="...">` in the HTML head.

---

## 📁 Monorepo Project Structure

```text
rabtech-audit-project/
├── client/          # Frontend UI skeleton & accessibility remediations
├── server/          # Backend API routing & security header configurations
├── docs/            # Audit reports, screenshots, and evaluation worksheets
└── test/            # Testing scripts and validation logs
