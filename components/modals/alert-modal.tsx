"use client"

import { useEffect, useState } from "react"

import Modal from '@/components/ui/modal'
import { Button } from "@/components/ui/button"
import useLoader from "@/hooks/use-loader"

interface AlertModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onConfirm,
    onClose
}) => {
    const [isMounted, setIsMounted] = useState(false)

    if (!isMounted) null

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const { onLoad, isLoading } = useLoader()

    return (
        <Modal
            title="Are you sure?"
            description="This action cannot be undone."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                <Button
                    variant="destructive"
                    onClick={() => {
                        onLoad()
                        onConfirm()
                        onClose()
                    }}
                    disabled={isLoading}
                >
                    Delete
                </Button>
            </div>
        </Modal>
    )
}