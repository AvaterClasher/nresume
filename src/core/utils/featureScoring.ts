/** @format */

// src/utils/featureScoring.ts

import type { FeatureSet, TextItem, TextScore, TextScores } from '../types';

export const computeFeatureScores = (
    textItems: TextItem[],
    featureSets: FeatureSet[]
): TextScores => {
    const textScores: TextScores = textItems.map(item => ({
        text: item.text,
        score: 0,
        match: false,
    }));

    textItems.forEach((item, index) => {
        featureSets.forEach(featureSet => {
            const [hasFeature, score, returnMatchingText] = featureSet;
            const result = hasFeature(item);
            if (result) {
                let text = item.text;
                if (returnMatchingText && Array.isArray(result)) {
                    text = result[0];
                }

                if (item.text === text) {
                    textScores[index].score += score;
                    if (returnMatchingText) {
                        textScores[index].match = true;
                    }
                } else {
                    textScores.push({ text, score, match: true });
                }
            }
        });
    });

    return textScores;
};

export const getTextWithHighestFeatureScore = (
    textItems: TextItem[],
    featureSets: FeatureSet[],
    returnEmptyStringIfHighestScoreIsNotPositive = true,
    returnConcatenatedStringForTextsWithSameHighestScore = false
): [string, TextScores] => {
    const textScores = computeFeatureScores(textItems, featureSets);

    let textsWithHighestFeatureScore: string[] = [];
    let highestScore = -Infinity;
    for (const { text, score } of textScores) {
        if (score >= highestScore) {
            if (score > highestScore) {
                textsWithHighestFeatureScore = [];
            }
            textsWithHighestFeatureScore.push(text);
            highestScore = score;
        }
    }

    if (returnEmptyStringIfHighestScoreIsNotPositive && highestScore <= 0) {
        return ['', textScores];
    }

    const text = !returnConcatenatedStringForTextsWithSameHighestScore
        ? textsWithHighestFeatureScore[0] ?? ''
        : textsWithHighestFeatureScore.map(s => s.trim()).join(' ');

    return [text, textScores];
};
