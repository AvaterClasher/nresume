// src/types/index.ts

export interface TextItem {
    text: string;
    fontName: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export type Lines = TextItem[][];

export interface ResumeSectionToLines {
    [sectionName: string]: Lines;
}

export interface ResumeEducation {
    school: string | null;
    degree: string | null;
    gpa: string | null;
    date: string | null;
    descriptions: string[];
}

export interface ResumeExperience {
    title: string | null;
    company: string | null;
    date: string | null;
    descriptions: string[];
}

export interface ResumeProject {
    title: string | null;
    description: string[];
    technologies: string[];
    duration: string | null;
}

export interface Resume {
    name: string | null;
    emails: string[];
    phoneNumbers: string[];
    education: ResumeEducation[];
    experience: ResumeExperience[];
    skills: string[];
    projects: ResumeProject[];
}

export type FeatureSet = [
    (item: TextItem) => boolean | RegExpMatchArray | null,
    number,
    boolean?
];

export interface TextScore {
    text: string;
    score: number;
    match: boolean;
}

export type TextScores = TextScore[];
