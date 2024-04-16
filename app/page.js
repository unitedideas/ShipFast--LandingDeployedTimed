import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Footer from "@/components/Footer";
import DataTableDemo from "@/components/Table";

export default function Home() {
    return (
        <>
            <Header/>
            <main>
                <Hero/>
                <Problem/>
                <DataTableDemo/>
            </main>
            <Footer/>
        </>
    );
}