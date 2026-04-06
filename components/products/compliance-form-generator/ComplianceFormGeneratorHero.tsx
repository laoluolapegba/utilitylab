import { FileCheck } from "lucide-react";

const painPoints = [
    "I spent hours on gov.uk trying to work out which form I actually need.",
    "I hired my first employee and got lost in P45/P46/starter checklist confusion.",
    "HMRC asks for terms like 'Class 1A NICs' and I have no idea what they mean.",
    "I keep repeating company details on every form and worrying about typos.",
    "One wrong box can mean rejection, delays, and potential penalties.",
    "Accountants quote £150-£300 for forms I wish I could complete myself.",
];

export default function ComplianceFormGeneratorHero() {
    return (
        <>
            <section className="bg-gradient-to-b from-indigo-50 via-white to-white py-16 lg:py-24 border-b border-slate-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center space-y-6">
                    <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-semibold">
                        <FileCheck className="w-4 h-4" /> UK Compliance Form Generator
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                        Stop wasting hours on government paperwork
                    </h1>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        Answer a few questions, get the exact forms you need, auto-filled and ready to download in minutes.
                        Built for UK sole traders, micro-businesses, and small limited companies.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#pricing" className="px-6 py-3 rounded-xl bg-[#566AF0] text-white font-semibold hover:opacity-95 transition-opacity">
                            Generate Your First Form - Free
                        </a>
                        <a href="#how-it-works" className="px-6 py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-50">
                            See How It Works
                        </a>
                    </div>
                    <p className="text-sm text-slate-500">✓ HMRC-aware guidance ✓ Auto-fill profile ✓ Print-ready PDF export</p>
                </div>
            </section>

            <section className="py-14">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <h2 className="text-3xl font-bold mb-6">If you run a UK business, this probably sounds familiar...</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {painPoints.map((point) => (
                            <div key={point} className="rounded-xl border border-slate-200 p-5 bg-slate-50">
                                <p className="text-slate-700">😤 {point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
