// src/utils/regex.ts

export const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;
export const phoneRegex =
    /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?){1}\d{3}[-.\s]?\d{4}/;
export const gpaRegex = /[0-4]\.\d{1,2}/;
export const gradeRegex = /\d+/;
export const wordRegex = /^[^0-9]+$/;
export const cgpaRegex = /(?:,?\s*(?:CGPA|GPA|SGPA)\s*[:\-]?\s*\d\.\d{1,2})/i;