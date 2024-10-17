/** @format */

import type { TextItem } from '../types';

const SCHOOLS = [
    'College',
    'University',
    'Institute',
    'School',
    'Academy',
    'BASIS',
    'Magnet',
];

const DEGREES = ['Associate', 'Bachelor', 'Master', 'PhD', 'Ph.'];

export const hasSchool = (item: TextItem) =>
    SCHOOLS.some(school => item.text.includes(school));

export const hasDegree = (item: TextItem) =>
    DEGREES.some(degree => item.text.includes(degree)) ||
    /[ABM][A-Z\.]/.test(item.text);

export const matchGPA = (item: TextItem) => item.text.match(/[0-9]\.\d{1,2}/);

export const matchGrade = (item: TextItem) => {
    const grade = parseFloat(item.text);
    if (Number.isFinite(grade) && grade <= 110) {
        return [String(grade)] as RegExpMatchArray;
    }
    return null;
};

export const hasYear = (item: TextItem) => /(?:19|20)\d{2}/.test(item.text);

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const hasMonth = (item: TextItem) =>
    MONTHS.some(
        month =>
            item.text.includes(month) || item.text.includes(month.slice(0, 4))
    );

export const SEASONS = ['Summer', 'Fall', 'Spring', 'Winter'];

export const hasSeason = (item: TextItem) =>
    SEASONS.some(season => item.text.includes(season));

export const hasPresent = (item: TextItem) => item.text.includes('Present');

export const hasJobTitle = (item: TextItem) => {
    return /ENGINEER|MANAGER|DEVELOPER|DIRECTOR|CONSULTANT|DESIGNER|ANALYST|COORDINATOR|SPECIALIST|LEAD|ADMINISTRATOR/.test(
        item.text.toUpperCase()
    );
};

export const hasCompany = (item: TextItem) => {
    const companyPattern =
        /Inc|LLC|Ltd|Corporation|Corp|Company|Group|Solutions|Systems/;
    if (companyPattern.test(item.text)) return true;

    const words = item.text.trim().split(' ');
    const isCapitalized = (word: string) => /^[A-Z][a-z]+/.test(word);

    if (words.length <= 3 && words.every(isCapitalized)) {
        return true;
    }

    return false;
};

export const hasLetter = (item: TextItem) => /[a-zA-Z]/.test(item.text);
export const hasNumber = (item: TextItem) => /[0-9]/.test(item.text);
export const hasComma = (item: TextItem) => item.text.includes(',');
