"use client"; // This is a client component 👈🏽

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FileUpload() {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("https://create-com-backend.vercel.app/upload", {
                method: "POST",
                body: formData,
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    const handleUpload = async () => {
        if (!uploadedFile) {
            toast.error("Please select a file to upload");
            return;
        }

        setUploading(true);

        try {
            const response = await uploadFile(uploadedFile);
            if (response.ok) {
                toast.success("File uploaded successfully");
                setUploadedFile(null);
            } else {
                console.error("Failed to upload file:", response.statusText);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        // You can optionally display the file name or size to the user
        console.log("Uploaded file:", file.name);
        console.log("File size:", file.size);
    };

    return (
        <div className="dropzone flex flex-col items-center justify-center">
            <label htmlFor="file-upload" className="cursor-pointer">
                <FileIcon className="h-12 w-12" />
            </label>
            <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e.target.files)}
                style={{ display: "none" }}
                id="file-upload"
            />
            {uploadedFile && (
                <p>Selected file: {uploadedFile.name} ({uploadedFile.size} bytes)</p>
            )}
            <Button
                size="xs"
                onClick={handleUpload}
                // disabled={!uploadedFile || uploading}
                className="bg-black text-white mt-2 p-2"
            >
                {uploading ? "Uploading..." : "Upload"}
            </Button>
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
    );
}

export default FileUpload;
