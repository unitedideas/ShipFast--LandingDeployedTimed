import {cookies} from "next/headers";
import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import {NextResponse} from "next/server";
import {getSessionAndValidate} from "@/app/util/getUserSession";
import {bucket_onlineyoutubethumbnailmaker} from "@/app/util/imageBucket";

export async function GET() {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient(
        {cookies: () => cookieStore}
    );

    const session = await getSessionAndValidate();
    // Proceed with logic using the session

    const folder = session.user.id;
    try {
        const {data} = await supabase
            .storage
            .from(bucket_onlineyoutubethumbnailmaker)
            .list(folder, {
                limit: 100,
                offset: 1,
                sortBy: {column: 'name', order: 'asc'},
            })

        return NextResponse.json({data}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}