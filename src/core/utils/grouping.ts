/** @format */

// src/utils/grouping.ts

import type { Lines, ResumeSectionToLines, TextItem } from '../types';

const Y_THRESHOLD = 5;

const SECTION_KEYWORDS = [
    'header',
    'education',
    'experience',
    'skills',
    'projects',
    'certifications',
    'summary',
    'contact',
];

function orderBy(
    items: any[],
    keys: string | any[],
    orders: any[]
): TextItem[] {
    return items.sort((a, b) => {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const order = orders[i];

            if (a[key] < b[key]) {
                return order === 'asc' ? -1 : 1;
            } else if (a[key] > b[key]) {
                return order === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });
}

export const groupTextItemsIntoLines = (textItems: TextItem[]): Lines => {
    if (textItems.length === 0) return [];

    const sortedItems = orderBy(textItems, ['y', 'x'], ['desc', 'asc']);

    const lines: Lines = [];
    let currentLine: TextItem[] = [];
    let currentY = sortedItems[0].y;

    sortedItems.forEach(item => {
        if (Math.abs(item.y - currentY) > Y_THRESHOLD) {
            if (currentLine.length > 0) {
                lines.push(currentLine);
                currentLine = [];
            }
            currentY = item.y;
        }
        currentLine.push(item);
    });

    if (currentLine.length > 0) {
        lines.push(currentLine);
    }

    return lines;
};

export const groupLinesIntoSections = (lines: Lines): ResumeSectionToLines => {
    const sections: ResumeSectionToLines = {
        header: [],
    };
    let currentSection: string = 'header';

    lines.forEach(line => {
        const lineText = line
            .map(item => item.text)
            .join(' ')
            .toLowerCase();

        const matchedKeyword = SECTION_KEYWORDS.find(keyword =>
            lineText.includes(keyword)
        );

        if (matchedKeyword) {
            currentSection = matchedKeyword;
            if (!sections[currentSection]) {
                sections[currentSection] = [];
            }
        } else {
            sections[currentSection].push(line);
        }
    });

    if (sections.header.length === 0) {
        delete sections.header;
    }

    return sections;
};
