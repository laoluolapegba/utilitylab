import MarketingNavbar from "@/components/landing/MarketingNavbar";
import Footer from "@/components/landing/Footer";
import InvoiceParserTool from "@/components/products/invoice-parser/InvoiceParserTool";

export const metadata = {
    title: "Invoice Parser for UK Freelancers | UtilityLab",
    description: "Upload PDF/image invoices to extract line items, VAT info, AI explanations, and accounting-ready exports.",
};

export default function InvoiceParserPage() {
    return (
        <>
            <MarketingNavbar />
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mb-10">
                            <p className="text-sm font-semibold tracking-wider uppercase text-[#566AF0]">New Tool</p>
                            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-[#0F172A]">Invoice Parser</h1>
                            <p className="mt-4 text-lg text-slate-600">
                                Drop a PDF invoice and get journal entries, VAT guidance, and Xero-ready output in minutes.
                            </p>
                        </div>
                        <InvoiceParserTool />
                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
}
