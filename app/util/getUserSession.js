// utils/auth.js
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function getSessionAndValidate() {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            throw new Error("You must be logged in to access the thumbnail generator.");
        }

        return session;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
