import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) new NextResponse("Unauthorized", { status: 401 });

        const { name } = await req.json();

        if (!name) new NextResponse("Name is required!", { status: 400 });

        if (!params.storeId) new NextResponse("Store ID is required!", { status: 400 });

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                // @ts-ignore
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) new NextResponse("Unauthorized", { status: 401 });

        if (!params.storeId) new NextResponse("Store ID is required!", { status: 400 });

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                // @ts-ignore
                userId
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};