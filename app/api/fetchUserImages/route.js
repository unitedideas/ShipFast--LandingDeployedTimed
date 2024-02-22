import {cookies} from "next/headers";
import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import {NextResponse} from "next/server";

export async function GET() {
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

    console.log("session.user.id")
    console.log(session.user.id)
    console.log(`session.user.id === "369abdd5-e4a9-4de9-8b5d-7e008aeaaab6"`)
    console.log(session.user.id === "369abdd5-e4a9-4de9-8b5d-7e008aeaaab6")
    const folder = session.user.id + "/";
    try {
        const { images, error } = await supabase
            .storage
            .from('uploads')
            .list(folder, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            })


        console.log("error")
        console.log(error)

        console.log("images")
        console.log(images)

        if (error) console.error(error);


        return NextResponse.json({images}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}