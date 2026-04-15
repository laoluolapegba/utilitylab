# Utility Lab - Project Documentation

## 🎯 Project Overview

**Utility Lab** is a privacy-first productivity platform offering focused tools for everyday tasks. Each tool solves one problem exceptionally well.
Privacy-first toolkit for independent ecommerce sellers (Etsy, Shopify, Amazon). No user data stored server-side. All processing client-side where possible.
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (Auth + DB), Google Vision API, AWS Textract

---
## Architecture rules
- Never log PII
- Invoice parser runs entirely in-browser (PDF.js + client-side extraction)
- API routes are thin — business logic lives in /lib, not /app/api
- Every function must have a JSDoc explaining what it does NOT how

## Current focus
Strengthening: invoice parser, repricing alerts, product optimiser

## 📁 Project Structure

```
app/
├── page.tsx                          # Homepage (umbrella brand)
├── app/
│   ├── image-to-text/               # ✅ Image to Text OCR
│   │   └── page.tsx                 # Marketing page + embedded tool
│   ├── image-converter/             # ✅ Image Format Converter
│   │   └── page.tsx                 # Multi-format image conversion
│   ├── invoice-parser/              # ✅ Invoice Parser (PDF to Accounting)
│   │   └── page.tsx                 # Invoice data extraction
│   └── product-listing-optimizer/   # ✅ E-commerce Product Optimizer
│       └── page.tsx                 # AI-powered listing generation
├── compliance-form-generator/       # ✅ UK Compliance Forms
│   └── page.tsx                     # HMRC-compliant form generator
├── repricing-alerts/                # ✅ Re-pricing Alerts
│   └── page.tsx                     # Competitor price monitoring
├── auth/                             # Supabase authentication
└── api/
    ├── extract-text/                 # OCR endpoint (Vision + Textract)
    ├── generate-insights/            # AI insights generation
    └── invoice-analyze/              # Invoice parsing endpoint

components/
├── landing/                          # Homepage components
│   ├── MarketingNavbar.tsx          # Auth-aware navigation
│   ├── HeroSection.tsx              # Homepage hero
│   ├── ProductsGrid.tsx             # All 6 products showcase
│   ├── PrivacySection.tsx           # Privacy-first messaging
│   ├── CTASection.tsx               # Conversion section
│   ├── FAQSection.tsx               # General FAQs
│   └── Footer.tsx                   # Site footer
│
└── products/
    ├── image-to-text/               # Image to Text components
    │   ├── ImageToTextHero.tsx      # Product hero with scroll CTA
    │   ├── HowItWorks.tsx           # 3-step process
    │   ├── ImageUpload.tsx          # Actual OCR tool
    │   ├── ImageToTextFeatures.tsx  # Feature grid
    │   ├── UseCases.tsx             # Target audiences
    │   ├── PricingSection.tsx       # Free vs Pro
    │   └── ProductFAQ.tsx           # Product-specific FAQs
    │
    ├── image-converter/             # Image format converter
    │   ├── ImageConverterTool.tsx   # Main conversion tool
    │   ├── FormatSelector.tsx       # Format selection UI
    │   ├── UploadZone.tsx           # File upload area
    │   ├── Preview.tsx              # Image preview
    │   └── DownloadPanel.tsx        # Download converted files
    │
    ├── invoice-parser/              # Invoice data extraction
    │   └── InvoiceParserTool.tsx    # PDF invoice parser
    │
    └── product-listing/             # E-commerce listing optimizer
        └── ProductListingOptimizerTool.tsx

lib/
├── supabaseClient.ts                # Supabase initialization
├── ocr/                             # OCR provider abstraction
│   ├── googleVisionProvider.ts     # Google Vision API
│   └── textractProvider.ts         # AWS Textract API
├── image-converter/                 # Image conversion logic
│   ├── converter.ts                # Core conversion engine
│   ├── batchProcessor.ts           # Batch processing
│   └── zip.ts                      # ZIP file creation
├── productListingOptimizer.ts      # Product listing AI logic
└── usageLimits.ts                  # Daily usage tracking
```

---

## 🎨 Design System

### Colors
```css
Primary: #566AF0        /* Purple-blue */
Primary Hover: #4355d6
Dark Text: #0F172A      /* slate-900 */
Body Text: #64748b      /* slate-600 */
Background: #ffffff
Background Alt: #f8fafc /* slate-50 */
```

### Typography
- **Font:** Inter (configured in `globals.css`)
- **Headings:** `font-bold tracking-tight`
- **Body:** `text-lg text-slate-600 leading-relaxed`

### Components
- **Buttons:** `rounded-full` with `btn-shadow` class
- **Cards:** `rounded-2xl` with subtle borders
- **Sections:** `py-20 lg:py-28` spacing
- **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Custom Classes
```css
.btn-shadow {
  box-shadow: 0px 4.45px 4.45px rgba(86, 90, 221, 0.4);
}
```

---

## 🔐 Authentication Flow

### User States
1. **Logged Out:** See "Sign in" + "Get Started" in navbar
2. **Logged In:** See "Sign out" + "Go to Tool" in navbar

### Protected Features
- Daily usage tracking (3 free conversions/day)
- OCR history (coming soon)
- Premium features (coming soon)

### Key Components
- `AuthGate.tsx` - Protects routes requiring authentication
- `UsageLimitGate.tsx` - Enforces daily limits
- `AuthForm.tsx` - Sign in/Sign up forms
- `SmartCTA.tsx` - Auth-aware CTA button

---


### 1. Image to Text (✅ LIVE)
**Route:** `/app/image-to-text`  
**Component:** `ImageUpload.tsx`  
**API:** `/api/extract-text`


### 2. Image Converter (✅ LIVE)
**Route:** `/app/image-converter`  
**Component:** `ImageConverterTool.tsx`

### 3. Invoice Parser (PDF to Accounting) (✅ LIVE)
**Route:** `/app/invoice-parser`  
**Component:** `InvoiceParserTool.tsx`  
**API:** `/api/invoice-analyze`  
**Note:** Also listed as "PDF to Accounting" on homepage (same tool)


### 4. E-commerce Product Listing Optimizer (✅ LIVE)
**Route:** `/app/product-listing-optimizer`  
**Component:** `ProductListingOptimizerTool.tsx`  
**Library:** `lib/productListingOptimizer.ts`


### 5. Compliance Form Generator (✅ LIVE)
**Route:** `/compliance-form-generator`


### 6. Re-pricing Alerts (✅ LIVE)
**Route:** `/repricing-alerts`

---


### `/api/generate-insights` (POST)
**Purpose:** AI-powered insights generation  
**Used by:** Product Listing Optimizer

### `/api/invoice-analyze` (POST)
**Purpose:** Invoice data extraction  
**Used by:** Invoice Parser / PDF to Accounting

---

## 🚀 Key Features

### Privacy-First
- **Zero data retention** - Files processed in memory, immediately deleted
- **No content logging** - Only metadata tracked
- **GDPR compliant** - Clear privacy policy
- **Local processing** - Where possible (Image Converter is fully client-side)


### Performance
- **Lazy loading** - Components load on demand
- **Image optimization** - Next.js Image component
- **API caching** - Smart provider selection
- **Error recovery** - Auto-retry with fallback
- **Client-side processing** - Where possible (Image Converter)


---
## Branch strategy
- main = production
- develop = active development branch

---
## 📝 Product Page Structure (Standard Pattern)

Each product follows this structure:

```typescript
// app/app/{product}/page.tsx
import MarketingNavbar from "@/components/landing/MarketingNavbar";
import {Product}Hero from "@/components/products/{product}/{Product}Hero";
import HowItWorks from "@/components/products/{product}/HowItWorks";
import {Product}Tool from "@/components/products/{product}/{Product}Tool";
import {Product}Features from "@/components/products/{product}/{Product}Features";
import UseCases from "@/components/products/{product}/UseCases";
import PricingSection from "@/components/products/{product}/PricingSection";
import ProductFAQ from "@/components/products/{product}/ProductFAQ";
import Footer from "@/components/landing/Footer";

export default function {Product}Page() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-white">
                <{Product}Hero />
                <HowItWorks />
                
                {/* Embedded Tool Section */}
                <section id="tool" className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl mb-6">
                                Try It Now
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                                Tool-specific description here
                            </p>
                        </div>
                        
                        <div className="max-w-5xl mx-auto">
                            <{Product}Tool />
                        </div>
                    </div>
                </section>
                
                <{Product}Features />
                <UseCases />
                <PricingSection />
                <ProductFAQ />
                <Footer />
            </main>
        </>
    );
}
```

---

## 🧪 Testing Checklist

### Before Committing
- [ ] All TypeScript errors resolved
- [ ] Components render on desktop and mobile
- [ ] Auth flow works (login/logout)
- [ ] All 6 product links navigate correctly
- [ ] Images load properly
- [ ] Scroll-to-tool behavior works on all products
- [ ] No console errors
- [ ] Usage limits enforced

---

## 🚀 Deployment

**Platform:** Vercel (recommended)  
**Branch:** `main` auto-deploys to production

**Build Command:**
```bash
npm run build
```

**Environment Variables:**
Set in Vercel dashboard under Settings → Environment Variables

---

## 🎯 Current Status

**✅ All Products:**
1. Image to Text - OCR extraction
2. PDF to Accounting (Invoice Parser) - Invoice data extraction
3. Image Converter - Format conversion
4. E-commerce Product Optimizer - AI listing generation
5. Re-pricing Alerts - Price monitoring
6. Compliance Form Generator - UK business forms


---

## 💡 Pro Tips for Claude Code

1. **All products follow same pattern** - Check existing product pages for structure
2. **Hero CTAs scroll to #tool** - Don't create separate routes
3. **Reuse components** - Footer, Navbar, common sections
4. **Privacy-first always** - Never log content, only metadata
5. **Auth-aware everywhere** - Use SmartCTA or auth checks
6. **Mobile-first** - Test responsive on all products
7. **ProductsGrid is source of truth** - Update when adding products

---

## 📞 Common Tasks

### Update Product Status
Edit `components/landing/ProductsGrid.tsx`:
```typescript
status: "live" // or "coming-soon"
```

### Add New Product Feature
1. Create component in `components/products/{product}/`
2. Add to product page in `app/app/{product}/page.tsx`
3. Update ProductsGrid if adding entirely new product

### Change Pricing
Update `components/products/{product}/PricingSection.tsx`

### Modify Daily Limits
Edit `lib/usageLimits.ts` or component-level constants

### Update Privacy Policy
Edit privacy section in product pages and homepage


---
 In all interactions and commit messages, be extremely concise and sacrifice grammar for the sake of brevity

## PR Comments
when i say add a comment to a PR with a TODO on it, use 'checkbox' markdown format to add the TODO. for instance


<example>
-[ ] A description of the todo goes here
</example>

-when tagging claude in GitHub issues, use '@claude'

##changesets
Tod add a changeset , write a new file to the `.changeset` directory
the file should be named `0000-your-change.md`. decide yourself whether to make it a patch ,minor, or major change
the format of the file should be : 
```md
---
"utilitylab": patch

Description of change.
```

the description of the change should be user-facing , describe what features were added or bugs were fixed.

##GitHub
- your primary method of interacting with GitHub should be GitHub CLI

## Git
- when creating branches , prefix them with laolu/ to indicate i originated them

## Plans
- at the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise. sacrifice grammar for the sake of concision.
make plans multi-phase
 
 
**Last Updated:** 2024  
**Version:** 2.0 - All Products Live! 🎉  
**Maintainer:** Utility Lab Team