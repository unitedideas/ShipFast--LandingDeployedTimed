import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <>
          <Header/>
            <main>
                <Hero/>
                <Problem/>
                <Pricing/>
                <FAQ/>
                <CTA/>
            </main>
            <Footer/>
        </>
    );
}