"use client"

import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

import useLoader from '@/hooks/use-loader'

const Loader = () => {
    const { isLoading } = useLoader()

    return (
        <dialog className={cn(
            'fixed top-0 left-0 h-full w-full place-content-center z-20 bg-background/80 backdrop-blur-sm',
            isLoading ? 'grid' : 'hidden'
        )}>
            <Loader2 className="h-10 w-10 animate-spin" />
        </dialog>
    )
}

export default Loader
