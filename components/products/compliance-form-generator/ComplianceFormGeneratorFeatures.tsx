import { Check, FileCheck, ShieldCheck, Sparkles, CalendarClock, FileDown, Users } from "lucide-react";

const features = [
    {
        title: "AI form discovery",
        description: "Describe your scenario in everyday language and get the correct HMRC/Companies House forms instantly.",
        icon: Sparkles,
    },
    {
        title: "Smart auto-fill profile",
        description: "Save your company number, UTR, VAT number, director details, and address once, then reuse everywhere.",
        icon: Users,
    },
    {
        title: "Plain-English guidance",
        description: "Every field includes non-jargon explanations, common examples, and links to official guidance when needed.",
        icon: FileCheck,
    },
    {
        title: "Validation before submission",
        description: "Catch missing fields, invalid formats, and common filing errors before you print or submit.",
        icon: ShieldCheck,
    },
    {
        title: "Deadline tracking",
        description: "Auto-calculate due dates and send reminders so you avoid late-filing penalties.",
        icon: CalendarClock,
    },
    {
        title: "Official PDF export",
        description: "Export clean, print-ready documents in official form layout with submission instructions.",
        icon: FileDown,
    },
];

const formBuckets = [
    {
        title: "HMRC Tax Forms",
        forms: ["SA100", "SA103S", "VAT1", "VAT484", "P11D", "P45/P46", "64-8", "CA5603"],
    },
    {
        title: "Companies House",
        forms: ["IN01 (guided)", "AP01", "TM01", "CH01", "AA01", "CS01 checklist", "DS01"],
    },
    {
        title: "Employment & HR",
        forms: ["New employee pack", "P60 template", "Contract template", "Holiday request", "Sickness form"],
    },
    {
        title: "GDPR & Operations",
        forms: ["Privacy notice", "Data processing agreement", "SAR form", "Data breach form", "Expense & mileage logs"],
    },
];

export default function ComplianceFormGeneratorFeatures() {
    return (
        <>
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <h2 className="text-3xl font-bold mb-8">Everything needed for routine compliance</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <article key={feature.title} className="rounded-2xl border border-slate-200 p-6 bg-white">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-14 bg-slate-50 border-y border-slate-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <h2 className="text-3xl font-bold mb-8">Launch form coverage</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {formBuckets.map((bucket) => (
                            <article key={bucket.title} className="rounded-xl bg-white border border-slate-200 p-5">
                                <h3 className="font-semibold text-lg mb-3">{bucket.title}</h3>
                                <ul className="space-y-2">
                                    {bucket.forms.map((form) => (
                                        <li key={form} className="flex items-center gap-2 text-slate-700 text-sm">
                                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            {form}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
