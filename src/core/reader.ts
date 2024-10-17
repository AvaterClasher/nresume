/** @format */

// src/utils/pdfReader.ts

import * as pdfjsLib from 'pdfjs-dist';
import type { TextItem } from './types';

export const readPdf = async (data: Uint8Array): Promise<TextItem[]> => {
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const numPages = pdf.numPages;

    const textItems: TextItem[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        content.items.forEach((item: any) => {
            const textItem: TextItem = {
                text: item.str,
                fontName: item.fontName,
                x: item.transform[4],
                y: item.transform[5],
                width: item.width,
                height: item.height,
            };
            textItems.push(textItem);
        });
    }

    return textItems;
};
