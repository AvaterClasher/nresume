/** @format */

// src/extractors/education.ts

import type {
    FeatureSet,
    Lines,
    ResumeEducation,
    ResumeSectionToLines,
    TextItem,
} from '../types';
import { getTextWithHighestFeatureScore } from '../utils/featureScoring';
import {
    getBulletPointsFromLines,
    getDescriptionsLineIdx,
} from '../utils/bulletPoints';
import {
    cgpaRegex,
    hasComma,
    hasDegree,
    hasLetter,
    hasMonth,
    hasNumber,
    hasPresent,
    hasSchool,
    hasSeason,
    hasYear,
    matchGPA,
    matchGrade,
} from '../utils';

export const extractEducation = (
    sections: ResumeSectionToLines
): ResumeEducation[] => {
    const educations: ResumeEducation[] = [];
    const lines = getSectionLinesByKeywords(sections, ['education']);
    if (lines.length === 0) return educations;

    const subsections = divideSectionIntoSubsections(lines);

    subsections.forEach(subsectionLines => {
        const textItems = subsectionLines.flat();

        const SCHOOL_FEATURE_SETS: FeatureSet[] = [
            [hasSchool, 4],
            [hasDegree, -4],
            [hasNumber, -4],
        ];

        const DEGREE_FEATURE_SETS: FeatureSet[] = [
            [hasDegree, 4],
            [hasSchool, -4],
            [hasNumber, -3],
        ];

        const GPA_FEATURE_SETS: FeatureSet[] = [
            [matchGPA, 4, true],
            [matchGrade, 3, true],
            [hasComma, -3],
            [hasLetter, -4],
        ];

        const DATE_FEATURE_SETS: FeatureSet[] = [
            [hasYear, 1],
            [hasMonth, 1],
            [hasSeason, 1],
            [hasPresent, 1],
            [hasComma, -1],
        ];

        const [school, _] = getTextWithHighestFeatureScore(
            textItems,
            SCHOOL_FEATURE_SETS
        );
        const [degree, __] = getTextWithHighestFeatureScore(
            textItems,
            DEGREE_FEATURE_SETS
        );
        const [gpa, ___] = getTextWithHighestFeatureScore(
            textItems,
            GPA_FEATURE_SETS
        );
        const [date, ____] = getTextWithHighestFeatureScore(
            textItems,
            DATE_FEATURE_SETS
        );

        const cleanDegree = (degree: string | null): string | null => {
            if (!degree) return null;
            const cleaned = degree.replace(cgpaRegex, '').trim();
            return cleaned.length > 0 ? cleaned : null;
        };

        const cleanedDegree = cleanDegree(degree);

        let descriptions: string[] = [];
        const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines);
        if (descriptionsLineIdx !== undefined) {
            const descriptionsLines =
                subsectionLines.slice(descriptionsLineIdx);
            descriptions = getBulletPointsFromLines(descriptionsLines);
        }

        educations.push({
            school,
            degree: cleanedDegree,
            gpa,
            date,
            descriptions,
        });
    });

    return educations;
};

const getSectionLinesByKeywords = (
    sections: ResumeSectionToLines,
    keywords: string[]
): Lines => {
    const matchedSections = Object.keys(sections).filter(section =>
        keywords.some(keyword => section.toLowerCase().includes(keyword))
    );

    const lines = matchedSections.flatMap(section => sections[section]);
    return lines;
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
