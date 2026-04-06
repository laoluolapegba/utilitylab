# Utility Lab - Project Documentation

## 🎯 Project Overview

**Utility Lab** is a privacy-first productivity platform offering focused tools for everyday tasks. Each tool solves one problem exceptionally well.

**All Products Now Live!** 🎉

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (Auth + DB), Google Vision API, AWS Textract

---

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

## 🛠️ All Products (Live!)

### 1. Image to Text (✅ LIVE)
**Route:** `/app/image-to-text`  
**Component:** `ImageUpload.tsx`  
**API:** `/api/extract-text`

**Features:**
- Multi-language OCR (50+ languages)
- Auto provider failover (Vision → Textract)
- 3 free daily conversions
- Export to TXT/JSON
- Privacy: Zero data retention

**Tech:**
- Google Vision API (primary)
- AWS Textract (fallback)
- Supabase for usage tracking

**User Flow:**
```
Landing page → Scroll to tool → Upload image → Get text → Copy/Export
```

### 2. Image Converter (✅ LIVE)
**Route:** `/app/image-converter`  
**Component:** `ImageConverterTool.tsx`

**Features:**
- Convert between 20+ formats (PNG, JPG, WEBP, GIF, BMP, TIFF, etc.)
- Batch processing (multiple files)
- Quality/compression controls
- ZIP download for multiple files
- Client-side conversion (no server upload needed)

**Tech:**
- Browser Canvas API
- Client-side image processing
- JSZip for batch downloads

### 3. Invoice Parser (PDF to Accounting) (✅ LIVE)
**Route:** `/app/invoice-parser`  
**Component:** `InvoiceParserTool.tsx`  
**API:** `/api/invoice-analyze`  
**Note:** Also listed as "PDF to Accounting" on homepage (same tool)

**Features:**
- Extract invoice data (vendor, amount, date, line items)
- Export to CSV/JSON
- Multi-currency support
- Structured data output for accounting software

**Tech:**
- PDF parsing
- OCR for scanned invoices
- AI-powered data extraction

### 4. E-commerce Product Listing Optimizer (✅ LIVE)
**Route:** `/app/product-listing-optimizer`  
**Component:** `ProductListingOptimizerTool.tsx`  
**Library:** `lib/productListingOptimizer.ts`

**Features:**
- AI-generated product titles
- SEO-optimized descriptions
- Multi-platform formatting (Amazon, eBay, Shopify)
- Keyword optimization
- Character count optimization per platform

**Tech:**
- OpenAI API / Claude API
- Platform-specific templates
- SEO best practices

### 5. Compliance Form Generator (✅ LIVE)
**Route:** `/compliance-form-generator`

**Features:**
- UK micro-business forms
- HMRC-compliant templates
- Auto-fill from user data
- PDF export
- Common forms: VAT returns, expense claims, etc.

**Tech:**
- PDF generation
- Form templates
- HMRC compliance validation

### 6. Re-pricing Alerts (✅ LIVE)
**Route:** `/repricing-alerts`

**Features:**
- Competitor price monitoring
- Real-time alerts
- Multi-marketplace support (Amazon, eBay, etc.)
- Custom threshold settings
- Email/SMS notifications

**Tech:**
- Web scraping
- Price tracking algorithms
- Notification system

---

## 🗄️ Database Schema (Supabase)

### Tables

**`usage_daily`**
```sql
user_id: uuid (FK to auth.users)
usage_date: date
used_count: integer
created_at: timestamp
updated_at: timestamp

PRIMARY KEY: (user_id, usage_date)
```

**`ocr_results`** (Analytics only - no content stored)
```sql
id: uuid
user_id: uuid
file_name: text
raw_text: null (privacy - never stored)
confidence: numeric
provider: text (google | textract)
has_text: boolean
text_length: integer
image_bytes: integer
image_width: integer
image_height: integer
is_success: boolean
error_message: text
created_at: timestamp
```

---

## 🔌 API Endpoints

### `/api/extract-text` (POST)
**Purpose:** OCR text extraction  
**Method:** POST  
**Body:** `FormData` with `file`  
**Headers:**
- `x-image-width`: number
- `x-image-height`: number
- `x-file-bytes`: number
- `x-file-name`: string

**Response:**
```json
{
  "rawText": "extracted text here",
  "confidence": 0.95,
  "providerUsed": "google"
}
```

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

### Usage Limits
- **Free Tier:** 3 conversions/day per user (varies by tool)
- **Tracking:** Cross-device via Supabase
- **Enforcement:** Client-side + server-side validation
- **Pro Plan:** Coming soon (unlimited)

### Performance
- **Lazy loading** - Components load on demand
- **Image optimization** - Next.js Image component
- **API caching** - Smart provider selection
- **Error recovery** - Auto-retry with fallback
- **Client-side processing** - Where possible (Image Converter)

---

## 🎯 User Flows

### New User (Not Logged In)
```
Homepage → See all 6 products → Click product → Product landing page → Scroll to tool → Sign up → Use tool
```

### Returning User (Logged In)
```
Homepage → "Go to Tool" → Any product page → Scroll to tool → Use immediately
```

### Direct Product Access
```
Share link → /app/{product} → See marketing + tool → Sign up if needed → Use tool
```

---

## 🛣️ Routing Structure

```
/                                    # Homepage (umbrella brand)
├── /#products                       # Products section (scroll)
├── /#pricing                        # Pricing section (scroll)
│
├── /app/image-to-text              # Image to Text (OCR)
├── /app/image-converter            # Image Format Converter
├── /app/invoice-parser             # Invoice Parser (PDF to Accounting)
├── /app/product-listing-optimizer  # E-commerce Product Optimizer
├── /compliance-form-generator      # UK Compliance Forms
├── /repricing-alerts               # Re-pricing Alerts
│
├── /auth?mode=signin               # Sign in
├── /auth?mode=signup               # Sign up
│
└── /api/
    ├── /extract-text               # OCR endpoint
    ├── /generate-insights          # AI insights
    └── /invoice-analyze            # Invoice parsing
```

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

## 📊 Homepage ProductsGrid Configuration

Update `components/landing/ProductsGrid.tsx`:

```typescript
const products = [
    {
        id: "image-to-text",
        name: "Image to Text",
        description: "Extract text from images instantly with professional-grade OCR technology.",
        icon: ImageIcon,
        status: "live",
        href: "/app/image-to-text",
        color: "from-blue-500 to-indigo-600",
        features: ["Multi-language support", "High accuracy OCR", "Batch processing"]
    },
    {
        id: "pdf-to-accounting",
        name: "PDF to Accounting",
        description: "Convert invoices, receipts, and statements into structured accounting data.",
        icon: FileText,
        status: "live",
        href: "/app/invoice-parser", // Note: same as invoice-parser
        color: "from-green-500 to-emerald-600",
        features: ["Auto-categorization", "Multi-currency", "Excel export"]
    },
    {
        id: "image-converter",
        name: "Image → Multiple Formats",
        description: "Convert images to any format instantly. Support for PNG, JPG, WEBP, and more.",
        icon: Layers,
        status: "live",
        href: "/app/image-converter",
        color: "from-purple-500 to-pink-600",
        features: ["20+ formats", "Batch conversion", "Quality control"]
    },
    {
        id: "product-listing",
        name: "E-commerce Product Optimiser",
        description: "Generate optimized product listings with AI-powered descriptions and SEO.",
        icon: ShoppingCart,
        status: "live",
        href: "/app/product-listing-optimizer",
        color: "from-orange-500 to-red-600",
        features: ["SEO optimization", "Multi-platform", "A/B testing"]
    },
    {
        id: "repricing-alerts",
        name: "Re-Pricing Alerts",
        description: "Monitor competitor prices and get instant alerts for price changes.",
        icon: Bell,
        status: "live",
        href: "/repricing-alerts",
        color: "from-cyan-500 to-blue-600",
        features: ["Real-time monitoring", "Custom thresholds", "Multi-marketplace"]
    },
    {
        id: "compliance-forms",
        name: "Compliance Form Generator",
        description: "Generate UK-compliant forms for micro-businesses instantly.",
        icon: FileCheck,
        status: "live",
        href: "/compliance-form-generator",
        color: "from-indigo-500 to-purple-600",
        features: ["HMRC compliant", "Auto-fill", "PDF export"]
    }
];
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

### Product Launch Checklist (All Products)
- [x] Hero section complete (all 6)
- [x] Tools embedded and functional (all 6)
- [x] "How It Works" sections (all 6)
- [x] Features grids populated (all 6)
- [x] Use cases defined (all 6)
- [x] Pricing sections (all 6)
- [x] FAQs (all 6)
- [x] SEO metadata added
- [x] Mobile responsive
- [x] Auth-aware navigation

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

**✅ All Products Complete:**
1. Image to Text - OCR extraction
2. PDF to Accounting (Invoice Parser) - Invoice data extraction
3. Image Converter - Format conversion
4. E-commerce Product Optimizer - AI listing generation
5. Re-pricing Alerts - Price monitoring
6. Compliance Form Generator - UK business forms

**🔨 Next Phase:**
- Pro plan implementation
- Payment integration (Stripe)
- API access for Pro users
- Advanced features (batch processing, API, etc.)
- User dashboard
- Analytics panel

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

## 🐛 Troubleshooting

### Issue: Product not showing on homepage
**Solution:** Add to ProductsGrid.tsx with correct status

### Issue: Tool not loading
**Solution:** Check component import path and #tool section exists

### Issue: Auth not detecting login
**Solution:** Verify Supabase client initialized, check browser console

### Issue: Scroll to tool not working
**Solution:** Ensure section has `id="tool"` attribute

### Issue: API endpoint failing
**Solution:** Check route.ts file, verify environment variables

---

**Last Updated:** 2024  
**Version:** 2.0 - All Products Live! 🎉  
**Maintainer:** Utility Lab Team