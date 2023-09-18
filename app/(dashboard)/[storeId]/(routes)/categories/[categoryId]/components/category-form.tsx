"use client"

import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard, Category } from "@prisma/client"

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

import useLoader from "@/hooks/use-loader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

const formSchema = z.object({
    name: z.string()
        .refine(value => value.length >= 1, {
            message: 'Please provide the name of the category!'
        }),
    billboardId: z.string()
        .refine(value => value.length >= 1, {
            message: 'Please select a billboard!'
        }),
})

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {

    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()

    const [open, setOpen] = useState(false)
    const { isLoading, onLoad, onStop } = useLoader()

    const title = initialData ? "Edit Category" : "Create Category"
    const description = initialData ? "Edit a category" : "Add a new category"
    const toastMessage = initialData ? "✅ Billboard updated!" : "✅ Category created!"
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
        }
    })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            onLoad()

            if (initialData)
                await axios.patch(`/api/${params.storeId}/categories/${params.billboardId}`, data);
            else
                await axios.post(`/api/${params.storeId}/categories`, data);

            router.refresh()
            router.push(`/${params.storeId}/categories`)

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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            toast({
                title: "Category deleted."
            });
            router.refresh()
            router.push(`/${params.storeId}/categories`)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: `Could not delete category. Make sure you removed all the categories using this billboard.`,
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
                                            disabled={isLoading}
                                            placeholder="Category name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Billboard
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a billboard" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {billboards.map((billboard) => (
                                                    <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                            router.push(`/${params.storeId}/categories`)
                        }}
                    >
                        Cancel
                    </Button>
                </form>
            </Form>
        </>
    )
}