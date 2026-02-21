import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between w-full">
            {/* Background ambient lighting effects */}
            <div className="fixed top-0 -z-10 h-full w-full">
                <div className="absolute top-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 opacity-50 mix-blend-screen"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] translate-y-1/3 opacity-50 mix-blend-screen"></div>
            </div>

            <div className="w-full relative z-10">
                <Hero />
                <About />
                <Projects />
            </div>

            <div className="w-full mt-20">
                <Footer />
            </div>
        </main>
    );
}
