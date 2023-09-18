"use client"

import { useParams, useRouter } from 'next/navigation'
import { Plus } from "lucide-react"

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'

import { CategoryColumn, columns } from './columns'

interface BillboardClientProps {
    data: CategoryColumn[]
}

export const CategoriesClient: React.FC<BillboardClientProps> = ({ data }) => {

    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Categories (${data.length})`}
                    description="Manage categories for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add new
                </Button>
            </div>
            <Separator />
            <DataTable data={data} columns={columns} searchKey='name' />
        </>
    )
}