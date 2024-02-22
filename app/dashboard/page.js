import ButtonAccount from "@/components/ButtonAccount";
import ThumbnailGenerator from "@/components/ThumbnailGenerator";
import ImageGallery from "@/components/ImageGallery";
export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
    return (
        <main className="min-h-screen p-8 pb-24">
            <section className="mx-auto space-y-8 w-full">
                <ButtonAccount/>
                <ThumbnailGenerator/>
                <ImageGallery/>
            </section>
        </main>
    );
}
