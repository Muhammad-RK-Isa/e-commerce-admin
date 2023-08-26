import { UserButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"

export default function HomePage() {
    return (
        <>
            <div className="flex items-center justify-between m-4">
                <div>Hello Admin Dashboard.</div>
                <UserButton />
            </div>
            <div className="flex gap-8 mt-20 mx-4 flex-wrap">
                <Button variant="default">
                    Default
                </Button>
                <Button variant="secondary">
                    Secondary
                </Button>
                <Button variant="destructive">
                    Destructive
                </Button>
                <Button variant="ghost">
                    Ghost
                </Button>
                <Button variant="link">
                    Link
                </Button>
            </div>
        </>
    )
};