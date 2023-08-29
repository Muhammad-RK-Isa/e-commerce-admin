import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb"

export default async function DashboardPage({
    params
}: {
    params: { storeId: string }
}) {

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    });

    if (store)
        return (
            <>
                <Navbar/>
                <div>This is the Dashboard.</div>
                Hello, {store.name}
            </>
        )
    return;
}