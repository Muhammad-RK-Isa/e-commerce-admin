"use client";

import {
    Store as StoreIcon,
    ChevronsUpDown,
    Check,
    PlusCircle
} from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Store } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";
import useStoreModal from "@/hooks/use-store-modal";
import { cn } from "@/lib/utils";

type PopOverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopOverTriggerProps {
    items: Store[];
}

export default function StoreSwitcher({
    items = []
}: StoreSwitcherProps) {

    const { onOpen } = useStoreModal();

    const params = useParams();
    const router = useRouter();

    const currentStore = items.find((item) => item.id === params.storeId);

    const [open, setOpen] = useState(false);

    const onStoreSelect = (store: { name: string, id: string }) => {
        setOpen(false);
        router.push(`/${store.id}`);
    };

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
                    {currentStore?.name}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store..." />
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {items.map((store) => (
                                <CommandItem
                                    key={store.id}
                                    onSelect={() => onStoreSelect(store)}
                                    className="text-sm"
                                >
                                    <StoreIcon className="mr-2 h-4 w-4" />
                                    {store.name}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            currentStore?.id === store.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    onOpen();
                                }}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create a new store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
