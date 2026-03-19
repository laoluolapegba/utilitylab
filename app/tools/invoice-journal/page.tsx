import Link from 'next/link';
import { CheckCircle, FileText, HelpCircle, TrendingUp } from 'lucide-react';
import Footer from '@/components/landing/Footer';
import MarketingNavbar from '@/components/landing/MarketingNavbar';

export default function InvoiceJournalLanding() {
  return (
    <>
      <MarketingNavbar />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900">Turn Invoices into Journal Entries in Seconds</h1>
            <p className="mb-8 text-xl text-gray-600">
              Upload your PDF invoice → Get tax-ready journal entries with plain English explanations. Built for UK freelancers,
              contractors, and sole traders.
            </p>
            <Link href="/tools/invoice-journal/process" className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700">
              Process Your First Invoice - Free
            </Link>
            <p className="mt-4 text-sm text-gray-500">No signup required • Privacy-first (files deleted after processing)</p>
          </div>
        </div>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">The Problem</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {[
                  '😤 "I spent 30 minutes trying to figure out if this expense is tax deductible"',
                  '😤 "My accountant charges £50 just to process one invoice"',
                  '😤 "I do not know which account code to use or how to record the VAT"',
                  '😤 "I am scared of making mistakes that HMRC will penalize me for"',
                ].map((problem) => (
                  <div key={problem} className="rounded-lg border border-red-200 bg-red-50 p-6 text-gray-700">{problem}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">How It Works</h2>
              <div className="space-y-8">
                {[
                  {
                    step: '1',
                    title: 'Upload Your Invoice',
                    body: 'Drag and drop any PDF or image invoice. Works with supplier invoices, receipts, contractor bills, and utility statements.',
                  },
                  {
                    step: '2',
                    title: 'AI Extracts the Details',
                    body: 'We read the invoice, extract amounts, VAT, dates, and line items. You can review the data before analysis.',
                  },
                  {
                    step: '3',
                    title: 'Get Plain English Explanation',
                    body: 'The AI explains what is tax deductible, what VAT you can reclaim, and why — in normal language, not accountant jargon.',
                  },
                  {
                    step: '4',
                    title: 'Download Journal Entries',
                    body: 'Export balanced journal entries as CSV, Xero-ready CSV, or a text summary you can send to your accountant.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">{item.step}</div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.body}</p>
                      {item.step === '3' && (
                        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                          <strong>Example:</strong> This is office supplies — 100% tax deductible for your business. You can reclaim the £24 VAT on your next VAT return.
                        </div>
                      )}
                      {item.step === '4' && (
                        <ul className="mt-4 space-y-2">
                          {['CSV export', 'Xero-ready CSV', 'Plain text summary'].map((label) => (
                            <li key={label} className="flex items-start gap-2 text-gray-700">
                              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                              <span>{label}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">What Makes This Different</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  { icon: HelpCircle, title: 'Plain English Explanations', body: 'We explain what is deductible and why in language non-accountants can actually use.' },
                  { icon: TrendingUp, title: 'UK Tax Compliant', body: 'Built around VAT, CIS, and sole-trader expense logic for UK businesses.' },
                  { icon: FileText, title: 'No Integration Needed', body: 'Download the output and import it into Xero, QuickBooks, or your spreadsheet.' },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Ready to Save Hours on Bookkeeping?</h2>
            <p className="mb-8 text-lg text-blue-100">Process your first invoice now — free, no signup required.</p>
            <Link href="/tools/invoice-journal/process" className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-colors hover:bg-blue-50">
              Upload Invoice Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
