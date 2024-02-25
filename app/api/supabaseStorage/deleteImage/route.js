import {cookies} from "next/headers";
import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import {NextResponse} from "next/server";
import {getSessionAndValidate} from "@/app/util/getUserSession";
import {bucket_onlineyoutubethumbnailmaker} from "@/app/util/imageBucket";

export async function DELETE(req) {
    const body = await req.json(); // Parse the request body to get JSON data
    const imageName = body.imageName; // Extract imageName from the parsed body

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient(
        {cookies: () => cookieStore}
    );

    const session = await getSessionAndValidate();

    const folder = session.user.id;
    const constructImageName = `${folder}/${imageName}`

    console.log("constructImageName");
    console.log(constructImageName);

    console.log("imageName");
    console.log(imageName);

    const {data, err} = await supabase
        .storage
        .from(bucket_onlineyoutubethumbnailmaker)
        .remove([`${folder}/${imageName}`])

    if (err) {
        console.log("err");
        console.log("err");
        console.log("err");
        console.log("err");
        console.log("err");
        console.log("err");
        console.log("err");
        console.log(err);
        console.log(err);
        console.log(err);
        console.log(err);
        console.log(err);
        console.log(err);
        console.log(err);
        // Return a response with a 400 status code on error
        return NextResponse.json({ error: err.message }, { status: 400 });
    } else {
        console.log("success");
        console.log("success");
        console.log("success");
        console.log("success");
        console.log("success");
        // Return a response with a 200 status code on success
        return NextResponse.json({data}, {status: 200});
    }
}