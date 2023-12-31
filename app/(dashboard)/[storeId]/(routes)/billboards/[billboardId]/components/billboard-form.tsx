"use client"

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
import ImageUpload from "@/components/ui/image-upload"

import useLoader from "@/hooks/use-loader";

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
            message: 'Please upload an image!'
        }),
})

type BillboardFormValues = z.infer<typeof formSchema>

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {

    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()

    const [open, setOpen] = useState(false)
    const { isLoading, onLoad, onStop} = useLoader()

    const title = initialData ? "Edit Billboard" : "Create Billboard"
    const description = initialData ? "Edit your billboards" : "Create a new billboard"
    const toastMessage = initialData ? "✅ Billboard updated!" : "✅ Billboard created!"
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageURL: ''
        }
    })

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            onLoad()

            if (initialData)
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            else
                await axios.post(`/api/${params.storeId}/billboards`, data);

            router.refresh()
            router.push(`/${params.storeId}/billboards`)

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
            onStop()
        }
    }

    const deleteBillboard = async () => {
        try {
            onLoad()
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            toast({
                title: "Billboard deleted."
            });
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: `Could not delete billboard. Make sure you removed all the categories using this billboard.`,
            });
        } finally {
            onStop()
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
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
                        disabled={isLoading}
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
                                        url={field.value ? field.value : ""}
                                        disabled={isLoading}
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
                                            disabled={isLoading}
                                            placeholder="Billboard label"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="ml-auto" disabled={isLoading}>
                        {action}
                    </Button>
                    <Button
                        variant="outline"
                        className="ml-2"
                        disabled={isLoading}
                        onClick={(e) => {
                            e.preventDefault()
                            router.refresh()
                            router.push(`/${params.storeId}/billboards`)
                        }}
                    >
                        Cancel
                    </Button>
                </form>
            </Form>
        </>
    )
}