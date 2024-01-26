import {NextResponse} from "next/server";
import OpenAI from "openai";
import imageType from "@/app/util/artTypeSelector";

export const runtime = 'edge';

const openAI = new OpenAI();
// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req) {
    const body = await req.json();

    const determinedStyle = setArtStyle(body.selectedStyleValue)

    console.log("determinedStyle", determinedStyle)

    const genBody = {
        model: "dall-e-3",
        // prompt: `${body.subject}, ${body.sceneDescription}, Sigma 85mm f/1.4`, // blurred background
        prompt: `${body.subject}, ${body.sceneDescription}, ${determinedStyle}`,
        quality: "standard",
        // quality: "hd",
        size: "1792x1024",
        // style: "natural",
        style: "vivid",
        response_format: "b64_json",
    }

    try {
        const thumbNail = await openAI.images.generate(genBody);

        return NextResponse.json({ thumbnail: thumbNail }, { status: 200 });
    } catch (e) {
        console.error("GPT Error: " + e);
        // Return a NextResponse object with an error status and message
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}

const setArtStyle = (selectedArtType) => {
    console.log("selectedArtType", selectedArtType)
    // Find the object in the array that matches the selectedArtType
    const selectedTypeObj = imageType.find(type => type.value === selectedArtType);
    // Return the description if found, otherwise return an empty string
    return selectedTypeObj ? selectedTypeObj.artStyleDescription : selectedArtType;
}
