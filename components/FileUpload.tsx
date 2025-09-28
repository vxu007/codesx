"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileChange: (acceptedFiles: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileChange(acceptedFiles);
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center w-full h-48 px-6 transition bg-white border-2 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-400 focus:outline-none ${
        isDragActive ? "border-purple-400 bg-purple-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <svg
        className="w-12 h-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        ></path>
      </svg>
      {isDragActive ? (
        <p className="mt-2 text-gray-600">Drop the files here ...</p>
      ) : (
        <p className="mt-2 text-gray-600">
          Drag 'n' drop your PDFs here, or click to select files
        </p>
      )}
    </div>
  );
};

export default FileUpload;