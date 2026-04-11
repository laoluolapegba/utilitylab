import MarketingNavbar from "@/components/landing/MarketingNavbar";
import Footer from "@/components/landing/Footer";

type Props = {
    children: React.ReactNode;
    /** Tailwind classes applied to the <main> element. Defaults to white background. */
    className?: string;
};

/**
 * Wraps every product page with the shared chrome: sticky navbar, scrollable main area, and footer.
 * Pass className to override the main element's background when a tool uses a coloured gradient.
 */
export default function ProductPageLayout({ children, className = "bg-white" }: Props) {
    return (
        <>
            <MarketingNavbar />
            <main className={`min-h-screen ${className}`}>
                {children}
            </main>
            <Footer />
        </>
    );
}
