"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: Store
};

const formSchema = z.object({
    name: z.string()
        .refine(value => value.length >= 1, {
            message: 'Name cannot be empty!'
        })
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const saveChanges = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();

            toast({
                title: "Store updated!",
                description: "All changes are saved.",
            });

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: "Changes are not saved.",
            });
        } finally {
            setLoading(false);
        };
    };

    const deleteStore = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            toast({
                title: "Store deleted."
            });
            router.refresh();
            router.push('/');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: `Could not delete <span className="font-bold">${initialData.name}</span>. Make sure you removed all products and categories already.`,
            });
        } finally {
            setLoading(false);
            setOpen(false);
        };
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                loading={loading}
                onConfirm={deleteStore}
                onClose={() => setOpen(false)}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title="Settings"
                    description="Manage store preferences"
                />
                <Button
                    variant="destructive"
                    size="sm"
                    disabled={loading}
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(saveChanges)}
                    className="space-y-8 w-full"
                >
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder={initialData.name}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="ml-auto" disabled={loading}>
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator />

            <Heading
                title="Api"
                description="Api and integration."
            />

            <ApiAlert
                title="NEXT_PUBLIC_API_URL"
                description={`${origin}/api/${params.storeId}`}
                variant="public"
            />
        </>
    );
};