"use client"; // This is a client component 👈🏽

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FileUpload() {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploading, setUploading] = useState(false);


    const uploadFileToS3 = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await fetch("http://localhost:8080/upload", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                const errorText = await response.text(); // Fetch the error message as text
                throw new Error(errorText || "Failed to upload to S3");
            }
            const data = await response.json();
            return data.url;
        } catch (error) {
            throw error;
        }
    };
    
    const uploadJsonToS3 = async (jsonFile) => {
        const formData = new FormData();
        formData.append("file", jsonFile);
    
        try {
            const response = await fetch("http://localhost:8080/upload", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                const errorText = await response.text(); // Fetch the error message as text
                throw new Error(errorText || "Failed to upload JSON to S3");
            }
            console.log(response)
            return response;
        } catch (error) {
            throw error;
        }
    };
    


    // const uploadFile = async (file) => {
    //     const formData = new FormData();
    //     formData.append("file", file);

    //     try {
    //         const response = await fetch("https://create-com-backend.vercel.app/upload", {
    //             method: "POST",
    //             body: formData,
    //         });
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    const handleUpload = async () => {
        if (!uploadedFile) {
            toast.error("Please select a file to upload");
            return;
        }
    
        setUploading(true);
    
        try {
            const imageUrl = await uploadFileToS3(uploadedFile);
            const jsonFileData = { imageUrl };
    
            const jsonBlob = new Blob([JSON.stringify(jsonFileData)], { type: 'application/json' });
            const jsonFile = new File([jsonBlob], "fileData.json", { type: 'application/json' });
    
            const response = await uploadJsonToS3(jsonFile);
            if (response.ok) {
                toast.success("Image and JSON uploaded successfully");
                setUploadedFile(null);
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Failed to upload JSON");
            }
        } catch (error) {
            console.error("Error during upload:", error.message);
            toast.error("Error: " + error.message);
        } finally {
            setUploading(false);
        }
    };
    
    const handleFileChange = (event) => {
        console.log("Event received in handleFileChange:", event);
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setUploadedFile(file);
            console.log("Uploaded file:", file.name, "File size:", file.size);
        } else {
            console.log("No file selected or file input is incorrect.");
        }
    };




    return (
        <div className="dropzone flex flex-col items-center justify-center">
            <label htmlFor="file-upload" className="cursor-pointer">
                <FileIcon className="h-12 w-12" />
            </label>
            <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}  // Pass the event directly
                style={{ display: "none" }}
                id="file-upload"
            />

            {uploadedFile && (
                <p>Selected file: {uploadedFile.name} ({uploadedFile.size} bytes)</p>
            )}
            <Button
                size="xs"
                onClick={handleUpload}
                disabled={!uploadedFile || uploading}  // Ensure the button is disabled when appropriate
                className={`mt-2 p-2 ${uploading || !uploadedFile ? 'bg-gray-400' : 'bg-black text-white'}`}
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
