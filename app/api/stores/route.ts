import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();

        const { name } = await req.json();

        if (!userId) new NextResponse("Unauthenticated", { status: 401 });
        if (!name) new NextResponse("Name is required!", { status: 400 });

        const store = await prismadb.store.create({
            data: {
                name,
                // @ts-ignore
                userId
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}