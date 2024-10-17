/** @format */

// src/parser.ts

import type { Lines, Resume, ResumeSectionToLines, TextItem } from './types';
import { readPdf } from './reader';
import {
    groupLinesIntoSections,
    groupTextItemsIntoLines,
} from './utils/grouping';
import { extractPersonalDetails } from './extractors/personalDetails';
import { extractEducation } from './extractors/education';
import { extractExperience } from './extractors/experience';
import { extractSkills } from './extractors/skills';

export const extractResumeFromSections = (
    sections: ResumeSectionToLines
): Resume => {
    const resume: Resume = {
        name: null,
        emails: [],
        phoneNumbers: [],
        education: [],
        experience: [],
        skills: [],
        projects: [],
    };

    const headerLines = sections['header'] || [];
    for (const line of headerLines) {
        const lineText = line.map(item => item.text).join(' ');

        if (!resume.name) {
            resume.name = lineText.trim();
            continue;
        }

        const { emails, phoneNumbers } = extractPersonalDetails([line]);
        resume.emails.push(...emails);
        resume.phoneNumbers.push(...phoneNumbers);
    }

    resume.education = extractEducation(sections);

    resume.experience = extractExperience(sections);

    resume.skills = extractSkills(sections);

    // Extract Projects (Doesnt work yet should just make a github integration to do this instead ig.)
    // resume.projects = extractProjects(sections);

    return resume;
};

export const parseResumeFromPdfData = async (
    pdfData: Uint8Array
): Promise<Resume> => {
    console.log(`Processing PDF data.`);
    const textItems = await readPdf(pdfData);
    console.log(`Extracted ${textItems.length} text items.`);

    // Group text items into lines
    // console.log('Grouping text items into lines...');
    const lines = groupTextItemsIntoLines(textItems);

    // Group lines into sections
    // console.log('Grouping lines into sections...');
    const sections = groupLinesIntoSections(lines);

    // Extract resume information from sections
    // console.log('Extracting resume information from sections...');
    const resume = extractResumeFromSections(sections);

    return resume;
};
