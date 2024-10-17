/** @format */

import type {
    FeatureSet,
    Lines,
    ResumeExperience,
    ResumeSectionToLines,
} from '../types';
import { getTextWithHighestFeatureScore } from '../utils/featureScoring';
import {
    getBulletPointsFromLines,
    getDescriptionsLineIdx,
} from '../utils/bulletPoints';
import {
    hasComma,
    hasCompany,
    hasJobTitle,
    hasMonth,
    hasNumber,
    hasPresent,
    hasSeason,
    hasYear,
} from '../utils';

export const extractExperience = (
    sections: ResumeSectionToLines
): ResumeExperience[] => {
    const experiences: ResumeExperience[] = [];

    const lines = getSectionLinesByKeywords(sections, ['experience', 'work']);
    if (lines.length === 0) return experiences;

    const subsections = divideSectionIntoSubsections(lines);

    subsections.forEach(subsectionLines => {
        const textItems = subsectionLines.flat();

        const TITLE_FEATURE_SETS: FeatureSet[] = [
            [hasJobTitle, 4],
            [hasCompany, -4],
            [hasNumber, -3],
        ];

        const COMPANY_FEATURE_SETS: FeatureSet[] = [
            [hasCompany, 4],
            [hasJobTitle, -4],
            [hasNumber, -3],
        ];

        const DATE_FEATURE_SETS: FeatureSet[] = [
            [hasYear, 1],
            [hasMonth, 1],
            [hasSeason, 1],
            [hasPresent, 1],
            [hasComma, -1],
        ];

        let [title] = getTextWithHighestFeatureScore(
            textItems,
            TITLE_FEATURE_SETS
        ) || ['', -Infinity];
        let [company] = getTextWithHighestFeatureScore(
            textItems,
            COMPANY_FEATURE_SETS
        ) || ['', -Infinity];
        let [date] = getTextWithHighestFeatureScore(
            textItems,
            DATE_FEATURE_SETS
        ) || ['', -Infinity];

        if (!title) {
            const possibleTitle = textItems.find(item => hasJobTitle(item));
            title = possibleTitle?.text || '';
        }

        let descriptions: string[] = [];
        const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines);
        if (descriptionsLineIdx !== undefined) {
            const descriptionsLines =
                subsectionLines.slice(descriptionsLineIdx);
            descriptions = getBulletPointsFromLines(descriptionsLines);
        }

        if (title || company || descriptions.length > 0) {
            experiences.push({
                title: title || 'Unknown Title',
                company: company || 'Unknown Company',
                date: date || 'Unknown Date',
                descriptions,
            });
        }
    });

    return experiences;
};

const getSectionLinesByKeywords = (
    sections: ResumeSectionToLines,
    keywords: string[]
): Lines => {
    const matchedSections = Object.keys(sections).filter(section =>
        keywords.some(keyword => section.toLowerCase().includes(keyword))
    );
    return matchedSections.flatMap(section => sections[section]);
};

const divideSectionIntoSubsections = (lines: Lines): Lines[] => {
    const subsections: Lines[] = [];
    let currentSubsection: Lines = [];

    lines.forEach(line => {
        const hasBold = line.some(item => /bold/i.test(item.fontName));
        if (hasBold && currentSubsection.length > 0) {
            subsections.push(currentSubsection);
            currentSubsection = [];
        }
        currentSubsection.push(line);
    });

    if (currentSubsection.length > 0) {
        subsections.push(currentSubsection);
    }

    return subsections;
};
