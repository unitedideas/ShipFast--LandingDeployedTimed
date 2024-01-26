import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ThumbnailGenerator from "@/components/ThumbnailGenerator";

export default function Home() {
    return (
        <>
          <Header/>
            <main>
                <Hero/>
                <Problem/>
                <ThumbnailGenerator/>
                <Pricing/>
                <FAQ/>
                <CTA/>
            </main>
            <Footer/>
        </>
    );
}