// src/extractors/skills.ts

import type { Lines, ResumeSectionToLines } from '../types';
import { getBulletPointsFromLines } from '../utils/bulletPoints';

export const extractSkills = (sections: ResumeSectionToLines): string[] => {
    const lines = getSectionLinesByKeywords(sections, ['skills']);
    if (lines.length === 0) return [];

    const bulletPoints = getBulletPointsFromLines(lines);
    if (bulletPoints.length > 0) {
        const skills = bulletPoints.flatMap(bp =>
            bp.split(',').map(skill => skill.trim())
        );
        return skills.filter(skill => skill.length > 0);
    }

    return lines
        .map(line => line.map(item => item.text).join(' '))
        .filter(text => text.length > 0);
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
