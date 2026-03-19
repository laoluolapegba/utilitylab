import type { Metadata } from "next";
import Link from "next/link";
import MarketingNavbar from "@/components/landing/MarketingNavbar";
import Footer from "@/components/landing/Footer";
import { FileText, Zap, CheckCircle, TrendingUp, Download, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
    title: "Invoice Parser - Turn Invoices into Journal Entries | UtilityLab",
    description:
        "Upload your PDF invoice and get tax-ready journal entries with VAT calculations and plain English explanations. Built for UK freelancers and sole traders.",
    keywords: ["invoice parser", "journal entries", "UK VAT", "bookkeeping", "accounting", "sole trader", "freelancer", "CIS", "tax deductible"],
    openGraph: {
        title: "Invoice Parser - UK Tax Compliant Journal Entries",
        description: "Process invoices in 30 seconds. Get journal entries, VAT calculations, and plain English tax guidance.",
        type: "website",
    },
};

export default function InvoiceParserLanding() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            UK Tax Compliant • VAT Ready • CIS Aware
                        </div>

                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Turn Invoices into Journal Entries in Seconds
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Upload your invoice → Get journal entries, VAT calculations, and plain English explanations. Built for UK
                            freelancers and sole traders who do their own books.
                        </p>

                        <Link
                            href="/tools/invoice-parser/upload"
                            className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                        >
                            Process Your First Invoice - Free
                        </Link>

                        <p className="text-sm text-gray-500 mt-4">
                            No signup required • 3 free invoices per day • Files deleted after processing
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-green-600">5,000+</div>
                            <div className="text-sm text-gray-600">Invoices processed</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-600">30 sec</div>
                            <div className="text-sm text-gray-600">Average processing time</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-green-600">£200</div>
                            <div className="text-sm text-gray-600">Avg. saved vs accountant</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">The Problem</h2>
                            <p className="text-gray-600 text-center mb-12 text-lg">
                                If you&apos;re a UK business owner doing your own bookkeeping, this probably sounds familiar...
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    '😤 "I spent an hour trying to figure out which account code to use and whether this expense is tax deductible"',
                                    '😤 "My accountant charges £50 to process a single invoice into my bookkeeping system"',
                                    '😤 "I have no idea if I can reclaim the VAT on this purchase or how to record it"',
                                    '😤 "I\'m terrified of making a mistake that HMRC will penalize me for later"',
                                ].map((quote) => (
                                    <div key={quote} className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                                        <p className="text-gray-800">{quote}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 bg-gray-100 border border-gray-300 rounded-lg p-6">
                                <p className="text-gray-700 text-center">
                                    <strong>The reality:</strong> Processing invoices is tedious, confusing, and expensive. You&apos;re
                                    spending hours on admin work instead of running your business.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">The Solution</h2>
                            <p className="text-gray-600 text-center mb-12 text-lg">Invoice Parser turns a 1-hour task into a 30-second task</p>

                            <div className="space-y-12">
                                {[
                                    {
                                        step: "1",
                                        title: "Upload Your Invoice",
                                        body: "Drag and drop any PDF or photo invoice. Works with receipts from Amazon, Screwfix, suppliers, contractors - anything with amounts and VAT.",
                                        extra: (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                                                <p className="text-sm text-blue-800 flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>PDF, JPG, PNG accepted • 10MB max • Instant processing</span>
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        step: "2",
                                        title: "AI Extracts Everything",
                                        body: "Our AI reads the invoice and extracts the vendor, invoice number, date, line items, amounts, and VAT breakdown. You can review and edit anything before you continue.",
                                        extra: (
                                            <ul className="grid md:grid-cols-2 gap-3 mb-4">
                                                {["Vendor name & address", "Invoice number & date", "Line item descriptions", "Amounts and VAT breakdown"].map((item) => (
                                                    <li key={item} className="flex items-center gap-2 text-gray-700">
                                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        ),
                                    },
                                    {
                                        step: "3",
                                        title: "Get Plain English Explanations",
                                        body: "No accountant jargon. We tell you what&apos;s deductible, how much VAT you can reclaim, which category to use, and any warnings you should know about.",
                                        extra: (
                                            <>
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                                                    <p className="text-green-900 font-medium mb-2">Example explanation:</p>
                                                    <p className="text-green-800 text-sm leading-relaxed">
                                                        This is <strong>office supplies</strong> - 100% tax deductible for your business. You can reclaim
                                                        the <strong>£24 VAT</strong> on your next VAT return if you&apos;re VAT registered. This expense will
                                                        reduce your taxable profit by <strong>£120</strong>, saving you approximately £24-30 in tax.
                                                    </p>
                                                </div>
                                                <ul className="space-y-2">
                                                    {[
                                                        "What&apos;s tax deductible (and what&apos;s not)",
                                                        "How much VAT you can reclaim",
                                                        "Correct category and account code",
                                                        "Any warnings or special considerations",
                                                    ].map((item) => (
                                                        <li key={item} className="flex items-start gap-2 text-gray-700">
                                                            <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        ),
                                    },
                                    {
                                        step: "4",
                                        title: "Download Ready-to-Use Entries",
                                        body: "Export CSV for spreadsheets, Xero-ready files, or plain text summaries you can send directly to your accountant.",
                                        extra: (
                                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                                {[
                                                    ["CSV Export", "Excel / Google Sheets"],
                                                    ["Xero Format", "Direct import ready"],
                                                    ["Text Summary", "Email to accountant"],
                                                ].map(([title, caption]) => (
                                                    <div key={title} className="border border-gray-200 rounded-lg p-4 text-center">
                                                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                                        <p className="font-medium text-gray-900 text-sm">{title}</p>
                                                        <p className="text-xs text-gray-500">{caption}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ),
                                    },
                                ].map((item) => (
                                    <div key={item.step} className="flex gap-6 items-start">
                                        <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-2xl">
                                            {item.step}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                                            <p className="text-gray-600 mb-4 text-lg">{item.body}</p>
                                            {item.extra}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Invoice Parser</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    [MessageSquare, "Plain English Guidance", "No accountant jargon. We explain tax rules in language you actually understand, with examples specific to your situation."],
                                    [TrendingUp, "UK Tax Compliant", "Built specifically for UK rules: VAT rates, CIS deductions, allowable expenses, and sole trader allowances."],
                                    [Zap, "Instant Processing", "Upload → Results in 30 seconds. No waiting, no manual data entry, and no back-and-forth with your accountant."],
                                    [CheckCircle, "Multiple Export Formats", "CSV for Excel, Xero-ready imports, and plain text summaries for whatever workflow you prefer."],
                                    [FileText, "Privacy First", "Your invoices are processed in-memory and deleted immediately. We never store your files or share your data."],
                                    [Download, "No Integration Required", "Just upload and download. No API keys, no account linking, and no complicated setup."],
                                ].map(([Icon, title, description]) => (
                                    <div key={title as string} className="bg-white rounded-lg p-6 shadow-sm">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                            <Icon className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{title as string}</h3>
                                        <p className="text-gray-600 text-sm">{description as string}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {[
                                    ["How accurate is the AI extraction?", "Very accurate for standard UK invoices, with review and edit controls before you generate journal entries."],
                                    ["Can this replace my accountant?", "No, but it can save you money on routine bookkeeping tasks. Use it for day-to-day processing and keep your accountant for year-end accounts, tax planning, and complex advice."],
                                    ["What types of invoices work best?", "Supplier invoices, contractor invoices, Amazon or eBay receipts, utility bills, equipment purchases, and professional services invoices all work well when the supplier, date, and totals are visible."],
                                    ["Do you store my invoices?", "No. Files are processed in-memory and deleted immediately after processing. We never keep the original PDF or image."],
                                    ["How does VAT handling work?", "We detect VAT amounts and rates, explain whether VAT is reclaimable, and generate entries that separate VAT input tax correctly."],
                                    ["What about CIS (Construction Industry Scheme)?", "If the invoice shows CIS deductions, the AI detects them and includes the deduction in the journal guidance."],
                                    ["How much does it cost?", "You can process 3 invoices per day for free without signing up. Create an account for unlimited processing."],
                                    ["Can I ask questions about my invoice?", "Yes. After processing, you can ask follow-up questions about tax treatment, deductibility, CIS, or alternative scenarios."],
                                    ["What if the extraction is wrong?", "You can edit vendor details, dates, totals, VAT, and line descriptions before generating the final output."],
                                ].map(([question, answer]) => (
                                    <details key={question} className="bg-white border border-gray-200 rounded-lg p-6 group">
                                        <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                                            <span>{question}</span>
                                            <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                                        </summary>
                                        <div className="mt-4 text-gray-600 space-y-2">
                                            <p>{answer}</p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-green-600 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Stop Spending Hours on Invoice Processing</h2>
                        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of UK business owners who&apos;ve saved time and money with Invoice Parser.
                        </p>
                        <Link
                            href="/tools/invoice-parser/upload"
                            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors shadow-lg"
                        >
                            Process Your First Invoice - Free
                        </Link>
                        <p className="text-green-100 text-sm mt-4">No signup required • 30 seconds to results</p>
                    </div>
                </div>

                <div className="bg-gray-50 py-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
                                {[
                                    "🇬🇧 UK Tax Compliant",
                                    "🔒 Privacy First",
                                    "⚡ Instant Processing",
                                    "✓ GDPR Compliant",
                                ].map((badge) => (
                                    <div key={badge} className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>{badge}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
