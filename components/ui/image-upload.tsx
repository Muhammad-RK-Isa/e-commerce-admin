"use client";

import { useEffect, useState } from "react";
import { ImagePlusIcon, Trash } from "lucide-react";
import { CldUploadWidget } from 'next-cloudinary';

import { Button } from "@/components/ui/button";
import Image from "next/image";

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

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    if (!isMounted) null;


    return (
        <>
            <div className="mb-4 flex items-center gap-4">
                {
                    url &&
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
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
                        />
                    </div>
                }
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="xrf5jewy">
                {({ open }) => (
                    <Button
                        variant="secondary"
                        onClick={() => open()}
                        disabled={!!url}
                    >
                        <ImagePlusIcon className="h-4 w-4 mr-2" />
                        Upload an Image
                    </Button>
                )}
            </CldUploadWidget>
        </>
    )
}

export default ImageUpload