import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb"

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();

        const { label, imageURL } = await req.json();

        if (!userId) new NextResponse("Unauthenticated", { status: 401 });
        if (!label) new NextResponse("Label is required!", { status: 400 });
        if (!imageURL) new NextResponse("ImageURL is required!", { status: 400 });
        if (!params.storeId) new NextResponse("Store ID is required!", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                // @ts-ignore
                userId
            }
        })

        if (!storeByUserId) new NextResponse("Unauthorized", { status: 403 })

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageURL,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) new NextResponse('Store ID is required!', { status: 400 })

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            }
        })

        console.log(billboards)
        return NextResponse.json(billboards);

    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}