"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import useStoreModal from "@/hooks/use-store-modal";

const formSchema = z.object({
    name: z.string().min(1),
})

export default function StoreModal() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })

    const { isOpen, onClose } = useStoreModal();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.table(values);
        console.log(values);
    }

    return (
        <Modal
            title="Create a new store."
            description="Let's start with creating your very first store to manage your products and customize your shop."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="What's the name of your store?" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-end pt-6 space-x-2">
                                <Button variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
};