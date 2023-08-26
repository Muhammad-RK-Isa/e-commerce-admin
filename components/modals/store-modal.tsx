"use client";

import Modal from "@/components/ui/modal";
import useStoreModal from "@/hooks/use-store-modal";

export default function StoreModal() {

    const { isOpen, onClose } = useStoreModal();

    return (
        <Modal
            title="Create a new store."
            description="Let's start with creating your very first store to manage your products and customize your shop."
            isOpen={isOpen}
            onClose={onClose}
        />
    )
};