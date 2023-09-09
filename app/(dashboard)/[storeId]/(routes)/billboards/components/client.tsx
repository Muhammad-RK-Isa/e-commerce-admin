"use client";

import { useParams, useRouter } from 'next/navigation';
import { Plus } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import prismadb from '@/lib/prismadb';
import { useEffect, useState } from 'react';

export const BillboardsClient = () => {
    
    const router = useRouter();
    const params = useParams();

    const [initialData, setInitialData] = useState([]);
    
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Bilboards (${initialData.length})`}
                    description="Manage billboards for your store."
                />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add new
                </Button>
            </div>
            <Separator/>
        </>
    );
};