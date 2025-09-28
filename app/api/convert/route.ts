import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import JSZip from "jszip";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const zip = new JSZip();

    const conversionPromises = files.map(async (file) => {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await pdfParse(buffer);

        const paragraphs = data.text.split("\n").map((line) => {
          return new Paragraph({
            children: [new TextRun(line)],
          });
        });

        const doc = new Document({
          sections: [
            {
              properties: {},
              children: paragraphs,
            },
          ],
        });

        const docxBuffer = await Packer.toBuffer(doc);
        zip.file(`${file.name.replace(/\.pdf$/, "")}.docx`, docxBuffer);
      } catch (error) {
        console.error(`Failed to convert file: ${file.name}`, error);
        // Optionally, you can add a file to the zip indicating the failure
        if (error instanceof Error) {
          zip.file(`${file.name}.error.txt`, `Conversion failed: ${error.message}`);
        } else {
          zip.file(`${file.name}.error.txt`, `Conversion failed: An unknown error occurred`);
        }
      }
    });

    await Promise.all(conversionPromises);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    const stream = new Readable();
    stream.push(zipBuffer);
    stream.push(null);

    const headers = new Headers();
    headers.append("Content-Type", "application/zip");
    headers.append(
      "Content-Disposition",
      `attachment; filename=converted_files.zip`
    );
    headers.append("Content-Length", zipBuffer.length.toString());


    const response = new Response(stream as any, {
      status: 200,
      headers,
    });

    // Add error handling for the stream
    stream.on('error', (error) => {
      console.error("Stream error:", error);
      // This part is tricky because headers might already be sent.
      // The client needs to handle this gracefully.
    });

    return response;

  } catch (error: any) {
    console.error("Conversion process failed:", error);
    return NextResponse.json(
      { error: "Conversion failed", details: error.message },
      { status: 500 }
    );
  }
}