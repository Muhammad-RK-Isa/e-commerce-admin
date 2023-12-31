"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";

import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import useStoreModal from "@/hooks/use-store-modal";

const formSchema = z.object({
    name: z.string()
        .refine(value => value.length >= 1, {
            message: "Store name cannot be empty!"
        })
});

export default function StoreModal() {

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    });

    const { toast } = useToast()
    const { isOpen, onClose } = useStoreModal()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            console.log(values);
            const response = await axios.post('/api/stores', values)
            window.location.assign(`/${response.data.id}`);
        } catch (error) {
            toast({
                title: "Something went wrong!",
                description: "Please try again.",
                variant: "destructive"
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            title="Create store"
            description="Create a store to manage your products and customize your store."
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
                                            <Input
                                                disabled={loading}
                                                placeholder="What's the name of your store?"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-end pt-6 space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onClose()
                                    }}
                                    disabled={loading}
                                >Cancel</Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                >Create</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
};