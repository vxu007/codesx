"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import ProgressBar from "../components/ProgressBar";
import GridPattern from "../components/GridPattern";
import { cn } from "../lib/utils";
import { BorderBeam } from "../components/magicui/BorderBeam";

const FileUpload = dynamic(() => import("../components/FileUpload"), {
  ssr: false,
});

const AnimatedCircularProgressBar = dynamic(
  () =>
    import("@/registry/magicui/animated-circular-progress-bar").then(
      (mod) => mod.AnimatedCircularProgressBar
    ),
  { ssr: false }
);

type ConversionStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "generating"
  | "success"
  | "error";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [convertingFile, setConvertingFile] = useState<string | null>(null);

  const handleFileChange = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 100 * 1024 * 1024) {
        setError(`File ${file.name} is too large (max 100MB)`);
        return false;
      }
      return true;
    });
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    setError(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus("uploading");
    setProgress(25);

    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
      setConvertingFile(file.name);
    });

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Conversion failed");
        } else {
          throw new Error("Conversion failed: Unexpected server response");
        }
      }

      setStatus("generating");
      setProgress(75);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
      setProgress(100);
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "converted_files.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    }
  };

  const statusMessages = useMemo(
    () => ({
      idle: "Select PDF files to convert",
      uploading: "Uploading...",
      analyzing: "Analyzing PDF structure...",
      generating: "Generating DOCX files...",
      success: "Conversion complete!",
      error: `Error: ${error}`,
    }),
    [error]
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-white dark:bg-dark-bg">
      <div className="relative flex size-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border bg-background p-8 sm:p-20 dark:bg-gray-800">
        <BorderBeam size={250} duration={12} delay={9} />
        <div className="z-10 w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Bulk PDF to DOCX Converter
            </h1>
            <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
              Convert multiple PDFs to DOCX in a single click.
            </p>
          </div>
          <div className="mt-8">
            <FileUpload onFileChange={handleFileChange} />
          </div>

          {files.length > 0 && (
            <div className="mt-8 flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-2/3">
                <h3 className="font-semibold text-lg text-gray-700 dark:text-white">Selected Files:</h3>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700 max-h-48 overflow-y-auto">
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {files.map((file, index) => (
                      <li key={index} className={`p-2 rounded-md ${convertingFile === file.name ? "font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/50" : ""}`}>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                <AnimatedCircularProgressBar
                  value={progress}
                  gaugePrimaryColor="rgb(79 70 229)"
                  gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                />
                <p className="text-center text-sm text-gray-700 dark:text-gray-300 h-6 mt-4">{statusMessages[status]}</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            {status !== "idle" && <ProgressBar progress={progress} />}
          </div>

          {status === "idle" && files.length > 0 && (
            <button
              onClick={handleConvert}
              className="w-full mt-6 px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transform transition-transform hover:scale-105"
            >
              Convert {files.length} file(s)
            </button>
          )}
          {status === "success" && (
            <button
              onClick={handleDownload}
              className="w-full mt-6 px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-300 transform transition-transform hover:scale-105"
            >
              Download ZIP
            </button>
          )}
        </div>
      </div>
    </main>
  );
}