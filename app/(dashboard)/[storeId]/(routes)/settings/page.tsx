import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface SettingsPageProps {
    params: {
        storeId: string
    }
};

const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    };

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    return (
        <div>
            This is the settings page for {store?.name}.
        </div>
    )
};

export default SettingsPage;
