import Header from "@/components/Header";
import ButtonLead from "@/components/ButtonLead";
import ThumbnailGenerator from "@/components/ThumbnailGenerator";

export default function Home() {
    return (
        <>
            <Header/>
            <br/>
            <main>
                <div><ButtonLead extraStyle="!max-w-none !w-full"/></div>

                <br/>

                <div><ThumbnailGenerator/></div>
            </main>
        </>
    );
}