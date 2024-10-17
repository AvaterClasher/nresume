// src/extractors/personalDetails.ts

import type { Lines } from '../types';
import { emailRegex, phoneRegex } from '../utils/regex';

export const extractPersonalDetails = (
    lines: Lines
): { name: string | null; emails: string[]; phoneNumbers: string[] } => {
    let name: string | null = null;
    const emails: string[] = [];
    const phoneNumbers: string[] = [];

    lines.forEach(line => {
        const lineText = line.map(item => item.text).join(' ');

        const emailMatches = lineText.match(emailRegex);
        if (emailMatches) {
            emails.push(emailMatches[0]);
        }

        const phoneMatches = lineText.match(phoneRegex);
        if (phoneMatches) {
            phoneNumbers.push(phoneMatches[0]);
        }

        if (!name) {
            const wordCount = lineText.trim().split(/\s+/).length;
            const hasLetterAndSpaces = (text: string) =>
                /^[A-Za-z]+\s[A-Za-z]+$/.test(text);
            if (wordCount >= 2 && hasLetterAndSpaces(lineText)) {
                const isPotentialName = line.every(item => {
                    return /bold/i.test(item.fontName);
                });
                if (isPotentialName) {
                    name = lineText;
                }
            }
        }
    });

    return { name, emails, phoneNumbers };
};
