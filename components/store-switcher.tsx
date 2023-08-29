"use client"

import {
    Store as StoreIcon,
    ChevronsUpDown
} from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Store } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import useStoreModal from "@/hooks/use-store-modal";
import { cn } from "@/lib/utils";

type PopOverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopOverTriggerProps {
    items: Store[];
}

export default function StoreSwitcher({
    className,
    items = []
}: StoreSwitcherProps) {

    const { isOpen, onOpen } = useStoreModal();

    const params = useParams();
    const router = useRouter();

    const currentStore = items.find((item) => item.id === params.storeId);

    const [open, setOpen] = useState(false);

    const onStoreSelect = (store: { id: string, storeId: string }) => {
        setOpen(false);
        router.push(`/${store.id}`);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between")}
                >
                    <StoreIcon className="mr-2 h-4 w-4" />
                    Current Store
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
        </Popover>
    )
}
