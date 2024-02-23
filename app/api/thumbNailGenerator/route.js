// route.js
import {NextResponse} from "next/server";
import OpenAI from "openai";
import {v4 as uuidv4} from 'uuid';
import {cookies} from "next/headers";
import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import fetch from 'node-fetch';
import {bucket_onlineyoutubethumbnailmaker} from "@/app/util/imageBucket";

export const runtime = 'edge';
const openAI = new OpenAI();
// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
export async function POST(req) {
    const body = await req.json();

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient(
        {cookies: () => cookieStore}
    );

    let session;

    try {
        const {
            data: {session: fetchedSession},
        } = await supabase.auth.getSession();

        session = fetchedSession;

        // User who are not logged in can't make a purchase
        if (!session) {
            return NextResponse.json(
                {error: "You must be logged in to access the thumbnail generator."},
                {status: 401}
            );
        }
    } catch (error) {
        console.error(error);
    }

    const userID = session?.user?.id;
    const genBody = {
        model: "dall-e-3",
        prompt: `main subject: ${body.mainSubject}, scene description: ${body.sceneDescription}, art style: ${body.artLabel}`,
        quality: "hd",
        size: "1792x1024", // or "1024x1792" for full-body portraits
        style: "natural",
        response_format: "url",
        user: userID
    }

    try {
        const thumbNail = await openAI.images.generate(genBody);

        const response = await fetch(thumbNail.data[0].url);
        if (!response.ok) throw new Error('Failed to fetch the thumbnail image');

        // Read the response as ArrayBuffer and convert to Buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload the buffer to Supabase storage
        supabase
            .storage
            .from(bucket_onlineyoutubethumbnailmaker)
            .upload(userID + "/" + uuidv4(), buffer, {
                contentType: 'image/png',
                upsert: true,
            })
            .then(({data, error}) => {
                if (error) {
                    console.error('Upload error:', error.message);
                } else {
                    console.log('Upload successful:', data);
                }
            });

        // Return success response
        return NextResponse.json({thumbnail: thumbNail}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}