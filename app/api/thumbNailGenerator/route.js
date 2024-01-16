import {NextResponse} from "next/server";
import OpenAI from "openai";

export const runtime = 'edge';

const openAI = new OpenAI();
// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req) {
    const body = await req.json();

    const genBody = {
        model: "dall-e-3",
        prompt: `In the style of: ${body.artStyle}.
        The Scene/Theme is: ${body.sceneDescription}.
        Main subject of the scene is: ${body.subject}.`,
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