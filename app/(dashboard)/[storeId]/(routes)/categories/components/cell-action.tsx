"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    Edit,
    MoreHorizontal,
    Trash,
    Copy
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

import { CategoryColumn } from "./columns"
import { AlertModal } from "@/components/modals/alert-modal"
import axios from "axios"
import useLoader from "@/hooks/use-loader"

interface CellActionProps {
    data: CategoryColumn
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const [open, setOpen] = useState(false)
    const { onLoad, onStop } = useLoader()

    const router = useRouter()
    const params = useParams()

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast({
            title: "Copied to clipboard!",
            description: id,
            duration: 1500
        })
    }

    const onDelete = async () => {
        try {
            onLoad()
            await axios.delete(`/api/${params.storeId}/categories/${data.id}`)
            router.refresh()
        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "Category could not be deleted.",
                variant: "destructive",
                duration: 500,
            })
        } finally {
            onStop()
            toast({
                title: "✅ Category deleted.",
                duration: 1500,
            })
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/20"
                    >
                        <Trash className="mr-2 h-4 w-4 p-0" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}