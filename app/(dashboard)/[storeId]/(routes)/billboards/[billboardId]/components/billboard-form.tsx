"use client";

import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/ui/image-upload"

interface BillboardFormProps {
    initialData: Billboard | null;
}

const formSchema = z.object({
    label: z.string()
        .refine(value => value.length >= 1, {
            message: 'Billboard must have a label!'
        }),
    imageURL: z.string()
        .refine(value => value.length >= 1, {
            message: 'You must provide an image link!'
        }),
})

type BillboardFormValues = z.infer<typeof formSchema>

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Billboard" : "Create Billboard";
    const description = initialData ? "Modify your Billboards" : "Add a new Billboard";
    const toastMessage = initialData ? "Billboard updated!" : "Billboard created!";
    const action = initialData ? "Save changes." : "Create";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageURL: ''
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true)

            if (initialData)
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            else
                await axios.post(`/api/${params.storeId}/billboards`, data);

            router.refresh()

            toast({
                title: toastMessage,
            })

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: "Changes are not saved.",
            });
        } finally {
            setLoading(false);
        }
    }

    const deleteBillboard = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            toast({
                title: "Billboard deleted."
            });
            router.refresh();
            router.push('/');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: `Could not delete billboard. Make sure you removed all the categories using this billboard.`,
            });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                loading={loading}
                onConfirm={deleteBillboard}
                onClose={() => setOpen(false)}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {
                    initialData &&
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={loading}
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                }
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <FormField
                        control={form.control}
                        name="imageURL"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Background Image
                                </FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Billboard label"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="ml-auto" disabled={loading}>
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />
        </>
    )
}