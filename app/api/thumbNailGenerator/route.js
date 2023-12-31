import {NextResponse} from "next/server";
import {sendOpenAi} from "@/libs/gpt";

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req) {
    const body = await req.json();

    if (!body.artStyle || !body.sceneDescription) {
        return NextResponse.json({error: "Style or Description missing"}, {status: 400});
    }

    try {
        // messages, userId, max = 100, temp = 1
        const messages = [
            { role: 'system', content: 'Your system message here, if any.' },
            { role: 'user', content: `Art style: ${body.artStyle}` },
            { role: 'user', content: `Scene description: ${body.sceneDescription}` }
        ];

        const response = await sendOpenAi(messages, 1, 100, 0.7);
        console.log(response);
        return NextResponse.json({response: response});
    } catch (e) {
        console.error(e.message);
        return NextResponse.json({error: e.message}, {status: 500});
    }
}
