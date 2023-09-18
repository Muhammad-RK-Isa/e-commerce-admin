"use client"

import { useEffect, useState } from "react"
import { ImagePlusIcon, Trash } from "lucide-react"
import { CldUploadWidget } from 'next-cloudinary'

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    disabled: boolean;
    url: string;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    url,
    onChange,
    onRemove
}) => {

    const [isMounted, setIsMounted] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url)
    }

    if (!isMounted) null

    return (
        <>
            <div className="mb-4 flex items-center gap-4">
                {
                    url &&
                    <>
                        <Skeleton className={cn(
                            "w-[200px] h-[200px] rounded-md",
                            loaded ? "hidden" : "flex"
                        )} />
                        <div className={cn(
                            "relative w-[200px] h-[200px] rounded-md overflow-hidden",
                            loaded ? "visible" : "invisible"
                        )}>
                            <div className="z-10 absolute top-2 right-2">
                                <Button type="button" onClick={() => onRemove(url)} variant="destructive" disabled={disabled}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                            <Image
                                fill
                                src={url}
                                alt="Image"
                                className="object-cover"
                                onLoad={() => setLoaded(true)}
                            />
                        </div>
                    </>
                }
            </div>
            {
                !url &&
                <CldUploadWidget onUpload={onUpload} uploadPreset="xrf5jewy">
                    {({ open }) => (
                        <Button
                            variant="secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                open()
                            }}
                            disabled={!!url}
                        >
                            <ImagePlusIcon className="h-4 w-4 mr-2" />
                            Upload an Image
                        </Button>
                    )}
                </CldUploadWidget>
            }
        </>
    )
}

export default ImageUpload