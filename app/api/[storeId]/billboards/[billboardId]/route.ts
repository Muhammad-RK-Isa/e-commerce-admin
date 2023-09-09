import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        if (!params.billboardId) new NextResponse("Billbaord id is required!", { status: 401 })

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
                storeId: params.storeId,
            }
        })

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string, imageURL: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) new NextResponse("Unauthorized", { status: 401 })

        const { label, imageURL } = await req.json()

        if (!params.billboardId) new NextResponse("Billboard id is required!", { status: 400 })
        if (!label) new NextResponse("Label is required!", { status: 400 })
        if (!imageURL) new NextResponse("Image URL is required!", { status: 400 })
        if (!params.storeId) new NextResponse("Store id is required!", { status: 400 })

        const storeByUserId = prismadb.store.findFirst({
            where: {
                id: params.storeId
            }
        })

        if (!storeByUserId) new NextResponse("Unauthorized!", { status: 403 })

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
                storeId: params.storeId,
            },
            data: {
                label,
                imageURL,
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) new NextResponse("Unauthenticated!", { status: 401 })
        if (!params.billboardId) new NextResponse("Billbaord id is required!", { status: 401 })
        if (!params.storeId) new NextResponse("Store id is required!", { status: 400 })

        const storeByUserId = prismadb.store.findFirst({
            where: {
                id: params.storeId
            }
        })

        if (!storeByUserId) new NextResponse("Unauthorized!", { status: 403 })

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
                storeId: params.storeId,
            }
        })

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}