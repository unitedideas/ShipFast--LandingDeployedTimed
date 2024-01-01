import {NextResponse} from "next/server";
import OpenAI from "openai";

const openAI = new OpenAI();
// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req) {
    await console.log("in the post call");
    const body = await req.json();
    await console.log("body", body);

    if (!body.sceneDescription) {
        console.log("Description missing");
        return NextResponse.json({error: "Description missing"}, {status: 400});
    }

    console.log("inside generateYoutubeThumbnail");
    try {
        const genBody = {
            model: "dall-e-3",
            prompt: `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: ${body.sceneDescription}`,
            // quality: "hd",
            size: "1792x1024",
            style: "vivid",
            response_format: "b64_json",
        }

        const thumbNail = await openAI.images.generate(genBody);
        console.log("thumbnail", thumbNail);
        // Return a NextResponse with the thumbnail data
        return NextResponse.json({ thumbnail: thumbNail }, { status: 200 });
    } catch (e) {
        console.error("GPT Error: " + e);
        // Return a NextResponse object with an error status and message
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}

