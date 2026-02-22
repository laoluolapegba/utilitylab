import { GraduationCap, Briefcase, BookOpen, Newspaper, Scale, Database } from "lucide-react";

const useCases = [
    {
        icon: GraduationCap,
        title: "Students & Teachers",
        description: "Convert lecture notes, textbook pages, and study materials into digital text for easy editing and sharing.",
        examples: ["Class notes", "Textbook pages", "Handwritten assignments"]
    },
    {
        icon: Briefcase,
        title: "Business Professionals",
        description: "Digitize business cards, receipts, invoices, and printed documents for efficient record-keeping.",
        examples: ["Invoices & receipts", "Business cards", "Meeting notes"]
    },
    {
        icon: BookOpen,
        title: "Researchers & Writers",
        description: "Extract text from research papers, books, and articles for citations and reference materials.",
        examples: ["Research papers", "Book excerpts", "Archive documents"]
    },
    {
        icon: Newspaper,
        title: "Content Creators",
        description: "Convert printed media, social media screenshots, and images into editable text for content creation.",
        examples: ["Social media posts", "Magazine articles", "Printed ads"]
    },
    {
        icon: Scale,
        title: "Legal Professionals",
        description: "Extract text from legal documents, contracts, and case files for analysis and documentation.",
        examples: ["Contracts", "Court documents", "Legal notices"]
    },
    {
        icon: Database,
        title: "Data Entry Teams",
        description: "Automate data extraction from forms, surveys, and printed documents to speed up workflows.",
        examples: ["Forms & surveys", "Printed data", "Archive records"]
    }
];

export default function UseCases() {
    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="block text-[#566AF0] mb-3 text-sm font-bold uppercase tracking-wider">
                        Who Uses This
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl mb-6">
                        Built for Everyone
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        From students to professionals, our Image to Text converter helps thousands save time every day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {useCases.map((useCase, index) => {
                        const Icon = useCase.icon;
                        return (
                            <div
                                key={index}
                                className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg border border-slate-100 hover:border-slate-200 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#566AF0] to-[#4355d6] p-3 mb-6">
                                    <Icon className="w-full h-full text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                                    {useCase.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    {useCase.description}
                                </p>

                                <div className="space-y-2">
                                    {useCase.examples.map((example, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#566AF0]" />
                                            {example}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}