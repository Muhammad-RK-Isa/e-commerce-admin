"use client"

import { useEffect, useState } from "react"

import Loader from "@/components/loader"

export default function LoaderProvider() {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) null

    return <Loader />
}
