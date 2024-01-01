import {NextResponse} from "next/server";
import OpenAI from "openai";

export const runtime = 'edge';

const openAI = new OpenAI();
// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req) {
    await console.log("in the post call");
    const body = await req.json();

    const genBody = {
        model: "dall-e-3",
        prompt: `In the form of: ${body.artStyle}.
        Scene: ${body.sceneDescription}.
        Main subject: ${body.subject}.
        The mood is ${body.tone}.
        Make sure you dont modify the following text: "${body.tnText}".
        This image needs to maximize views based on the data of views for other youtube thumbnails.
        Do no include the YouTube logo or the text "YouTube"`,
        quality: "hd",
        size: "1792x1024",
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