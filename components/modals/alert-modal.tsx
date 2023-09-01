"use client";

import { useEffect, useState } from "react";

import Modal from '@/components/ui/modal';
import { Button } from "@/components/ui/button";

interface AlertModalProps {
    isOpen: boolean;
    loading: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    loading,
    onConfirm,
    onClose
}) => {

    const [isMounted, setIsMounted] = useState(false);

    if (!isMounted) null;

    useEffect(() => {
        setIsMounted(true);
    }, [])

    return (
        <Modal
            title="Save changes?"
            description="Warning: This action cannot be undone!"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button variant="destructive" onClick={onConfirm} disabled={loading}>Delete</Button>
            </div>
        </Modal>
    )
}