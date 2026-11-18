/**
 * Textbook data seeds inspected directly in the user's ENEE 641
 * Chapter35Nov17-2026.pptx lecture deck (slides 3, 6, 8, 14, 15).
 * CLRS, Introduction to Algorithms, second edition.
 * Mathematical data only; no textbook illustrations reproduced.
 *
 * Positions used by renderers are original and need not trace source art.
 */
export const SOURCE_BOOK = 'Cormen, Leiserson, Rivest & Stein, Introduction to Algorithms, 2nd ed.';
export const SOURCE_DECK = 'Chapter35Nov17-2026.pptx';

export const vertexCoverFigure351 = {
  id: 'clrs-35-1',
  figure: 'Figure 35.1',
  slide: 3,
  provenance: 'Textbook example — original rendering',
  n: 7,
  labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  // First three edges are selected in the textbook walkthrough.
  edges: [[1,2], [4,5], [3,6], [0,1], [2,3], [2,4], [3,4], [3,5]],
  positions: [[65,95],[155,125],[240,75],[345,135],[270,265],[415,300],[475,80]],
  expectedMatching: [[1,2],[4,5],[3,6]],
  expectedCoverSize: 6,
  expectedOptimumSize: 3
};

export const tspFigure352 = {
  id: 'clrs-35-2',
  figure: 'Figure 35.2',
  slide: 6,
  provenance: 'Textbook example — original rendering',
  labels: ['a','b','c','d','e','f','g','h'],
  // Coordinates read from the integer grid in Figure 35.2(a).
  points: [[1,0],[1,2],[0,3],[3,0],[4,1],[3,2],[5,2],[2,4]],
  expectedPreorder: [0,1,2,7,3,4,5,6],
  expectedApproximateTourCost: 19.073950245236315,
  expectedOptimumTourCost: 14.714776642118865
};

export const setCoverFigure353 = {
  id: 'clrs-35-3',
  figure: 'Figure 35.3',
  slide: 8,
  provenance: 'Textbook example — original rendering',
  universe: [1,2,3,4,5,6,7,8,9,10,11,12],
  // The twelve points are numbered row-major in the reconstruction.
  sets: [
    [1,2,3,4,5,6], // S1: top two rows
    [5,6,8,9],     // S2: middle-right
    [1,4,7,10],    // S3: left column
    [2,5,8,11],    // S4: middle column
    [3,6,9,12],    // S5: right column
    [10,11]        // S6: bottom-left pair
  ],
  // The lecture figure specifies an allowed greedy tie-breaking sequence.
  preferredOrder: [0,3,4,2,1,5],
  expectedGreedy: [0,3,4,2],
  expectedOptimum: [2,3,4]
};

export const subsetSumLecture = {
  id: 'lecture-ch35-slide15',
  slide: 15,
  provenance: 'Lecture slide example — original rendering',
  values: [104,102,201,101],
  target: 308,
  epsilon: 0.4,
  expectedDelta: 0.05,
  expectedOptimum: 307
};

export const trimLecture = {
  id: 'lecture-ch35-slide14',
  slide: 14,
  provenance: 'Lecture slide example — original rendering',
  values: [10,11,12,15,20,21,22,23,24,29],
  delta: 0.1,
  expected: [10,12,15,20,23,29]
};
