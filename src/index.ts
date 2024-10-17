/** @format */

// src/adapters/browser.ts

import { parseResumeFromPdfData } from './core/parser';

export const parseResumeFromFile = async (file: File): Promise<any> => {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    return await parseResumeFromPdfData(data);
};

export * as pdfjs from 'pdfjs-dist';
