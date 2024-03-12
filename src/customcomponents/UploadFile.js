"use client"; // This is a client component 👈🏽

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button"

function FileUpload() {
    const [uploadedFile, setUploadedFile] = useState(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        // You can optionally display the file name or size to the user
        console.log("Uploaded file:", file.name);
        console.log("File size:", file.size);

        // Send the file to your backend for upload
        // Example: sendFileToBackend(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <FileIcon className="h-12 w-12" />
            <div className="text-sm">

                <Button size="xs" variant="ghost">
                    Upload Files
                </Button>
                <span className="block text-xs text-gray-500 dark:text-gray-400">or drag and drop</span>
            </div>
            {uploadedFile && (
                <p>Selected file: {uploadedFile.name} ({uploadedFile.size} bytes)</p>
            )}
        </div>
    );
}

function FileIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    )
}

export default FileUpload;
