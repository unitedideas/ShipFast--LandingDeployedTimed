"use client";
import CustomSlider from "@/components/Slider";
import ButtonSignin from "@/components/ButtonSignin";

const images = [
    '/assets/asset_thumbnail_1.png',
    '/assets/thumbnail - 2024-01-25T213552.168.png',
    '/assets/thumbnail - 2024-01-25T233704.106.png',
    '/assets/thumbnail - 2024-01-25T230943.667.png',
    '/assets/thumbnail - 2024-01-25T235606.498.png',
];

const Hero = () => {
    return (
        <section
            className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
            <div
                className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
                <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
                    Generate YouTube Thumbnails Fast!
                </h1>
                <p className="text-lg opacity-80 leading-relaxed">
                    Generate thumbnails at the highest resolution Youtube will allow.
                    Then add text to them.
                    From idea to posted in seconds.
                </p>
                <ButtonSignin extraStyle="btn-primary" text={"Create your Thumbnail Free"}/>
                {/*<TestimonialsAvatars priority={true}/>*/}
            </div>

            <div className="lg:w-full">
                <CustomSlider images={images}/>
            </div>
        </section>
    );
};

export default Hero;
