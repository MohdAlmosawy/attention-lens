
import { ExampleSentence } from './types';

const inputStr =
  "When I arrived at the station, I noticed a man holding a bat. No one around me reacted, so I assumed it was normal to carry one there. He remained completely still for a long time. It wasn’t until the train arrived and the station grew brighter that people realized he was holding a live bat, only then did panic break out.";

// split(" ") keeps punctuation attached (e.g. "station,", "bat."). 
// The indices below correspond to this exact split.
export const inputWords = inputStr.split(" ");

const idx = {
  When: 0, I_1: 1, arrived_1: 2, at: 3, the_1: 4, station_1: 5, I_2: 6, noticed: 7, a_1: 8, man: 9, holding_1: 10, a_2: 11, bat_1: 12,
  No: 13, one: 14, around: 15, me: 16, reacted: 17, so: 18, I_3: 19, assumed: 20, it_1: 21, was_1: 22, normal: 23, to: 24, carry: 25, one_2: 26, there: 27,
  He: 28, remained: 29, completely: 30, still: 31, for: 32, a_3: 33, long: 34, time: 35,
  It_2: 36, wasnt: 37, until: 38, the_2: 39, train: 40, arrived_2: 41, and: 42, the_3: 43, station_2: 44, grew: 45, brighter: 46, that: 47, people: 48, realized: 49, he: 50, was_2: 51, holding_2: 52, a_4: 53, live: 54, bat_2: 55, only: 56, then: 57, did: 58, panic: 59, break: 60, out: 61
};

/** Normalize array to sum to exactly 1.0 */
const normalize = (arr: number[]) => {
  const s = arr.reduce((a, b) => a + b, 0);
  if (s <= 0) return arr.map(() => 1 / arr.length);
  return arr.map(v => v / s);
};

/** Build weights from sparse targets */
const sparseTargets = (targets: { [k: number]: number }) => {
  const w = new Array(inputWords.length).fill(0.0);
  for (const [k, v] of Object.entries(targets)) {
    const center = parseInt(k, 10);
    if (center >= 0 && center < inputWords.length) w[center] += v;
  }
  return normalize(w);
};

// ---------- Sequential Mapping (Failed Context) ----------
const seqArabic = [
  "عندما","وصلتُ","إلى","المحطة،","لاحظتُ","رجلًا","يحمل","مضربًا.",
  "لم","يُبدِ","أي","شخص","من","حولي","ردّ","فعل،","لذلك","افترضتُ","أن",
  "حمل","المضرب","هناك","أمرٌ","طبيعي.","بقي","ثابتًا","دون","حراك","لفترة",
  "طويلة","جدًا.","ولم","يدرك","الناس","أنه","كان","يحمل","خفاشًا","حيًا",
  "إلا","بعد","وصول","القطار","وازدياد","إضاءة","المحطة،","وعندها","فقط",
  "بدأ","الذعر","ينتشر","وعمّ","الهلع."
];

const sequentialWeights: number[][] = [
  sparseTargets({ [idx.When]: 0.9, [idx.I_1]: 0.1 }), 
  sparseTargets({ [idx.arrived_1]: 0.8, [idx.I_1]: 0.2 }),
  sparseTargets({ [idx.at]: 0.7, [idx.the_1]: 0.2, [idx.station_1]: 0.1 }),
  sparseTargets({ [idx.station_1]: 0.85, [idx.at]: 0.1, [idx.the_1]: 0.05 }),
  sparseTargets({ [idx.noticed]: 0.85, [idx.I_2]: 0.15 }),
  sparseTargets({ [idx.man]: 0.9, [idx.a_1]: 0.1 }),
  sparseTargets({ [idx.holding_1]: 0.8, [idx.man]: 0.1, [idx.a_1]: 0.1 }),
  sparseTargets({ [idx.bat_1]: 0.55, [idx.holding_1]: 0.30, [idx.man]: 0.15 }),
  sparseTargets({ [idx.No]: 0.60, [idx.one]: 0.25, [idx.reacted]: 0.15 }),
  sparseTargets({ [idx.reacted]: 0.70, [idx.around]: 0.15, [idx.one]: 0.15 }),
  sparseTargets({ [idx.No]: 0.35, [idx.one]: 0.35, [idx.around]: 0.30 }),
  sparseTargets({ [idx.one]: 0.70, [idx.around]: 0.20, [idx.me]: 0.10 }),
  sparseTargets({ [idx.around]: 0.60, [idx.me]: 0.25, [idx.one]: 0.15 }),
  sparseTargets({ [idx.around]: 0.65, [idx.me]: 0.35 }),
  sparseTargets({ [idx.reacted]: 0.80, [idx.so]: 0.20 }),
  sparseTargets({ [idx.reacted]: 0.70, [idx.so]: 0.20, [idx.assumed]: 0.10 }),
  sparseTargets({ [idx.so]: 0.80, [idx.I_3]: 0.10, [idx.assumed]: 0.10 }),
  sparseTargets({ [idx.assumed]: 0.85, [idx.I_3]: 0.15 }),
  sparseTargets({ [idx.it_1]: 0.35, [idx.was_1]: 0.35, [idx.to]: 0.30 }),
  sparseTargets({ [idx.carry]: 0.60, [idx.to]: 0.25, [idx.one_2]: 0.15 }),
  sparseTargets({ [idx.one_2]: 0.30, [idx.carry]: 0.30, [idx.bat_1]: 0.25, [idx.holding_1]: 0.15 }),
  sparseTargets({ [idx.there]: 0.70, [idx.carry]: 0.20, [idx.one_2]: 0.10 }),
  sparseTargets({ [idx.was_1]: 0.35, [idx.normal]: 0.35, [idx.it_1]: 0.30 }),
  sparseTargets({ [idx.normal]: 0.70, [idx.was_1]: 0.20, [idx.it_1]: 0.10 }),
  sparseTargets({ [idx.remained]: 0.80, [idx.He]: 0.20 }),
  sparseTargets({ [idx.still]: 0.70, [idx.completely]: 0.20, [idx.remained]: 0.10 }),
  sparseTargets({ [idx.completely]: 0.55, [idx.still]: 0.35, [idx.for]: 0.10 }),
  sparseTargets({ [idx.still]: 0.65, [idx.completely]: 0.25, [idx.time]: 0.10 }),
  sparseTargets({ [idx.for]: 0.70, [idx.time]: 0.30 }),
  sparseTargets({ [idx.long]: 0.75, [idx.time]: 0.25 }),
  sparseTargets({ [idx.long]: 0.55, [idx.time]: 0.30, [idx.a_3]: 0.15 }),
  sparseTargets({ [idx.It_2]: 0.45, [idx.wasnt]: 0.35, [idx.until]: 0.20 }),
  sparseTargets({ [idx.realized]: 0.75, [idx.people]: 0.15, [idx.that]: 0.10 }),
  sparseTargets({ [idx.people]: 0.80, [idx.realized]: 0.20 }),
  sparseTargets({ [idx.that]: 0.60, [idx.he]: 0.25, [idx.was_2]: 0.15 }),
  sparseTargets({ [idx.was_2]: 0.70, [idx.he]: 0.20, [idx.holding_2]: 0.10 }),
  sparseTargets({ [idx.holding_2]: 0.75, [idx.was_2]: 0.15, [idx.he]: 0.10 }),
  sparseTargets({ [idx.live]: 0.45, [idx.bat_2]: 0.40, [idx.holding_2]: 0.10, [idx.realized]: 0.05 }),
  sparseTargets({ [idx.live]: 0.60, [idx.bat_2]: 0.25, [idx.holding_2]: 0.15 }),
  sparseTargets({ [idx.until]: 0.55, [idx.that]: 0.25, [idx.only]: 0.20 }),
  sparseTargets({ [idx.until]: 0.60, [idx.arrived_2]: 0.25, [idx.train]: 0.15 }),
  sparseTargets({ [idx.arrived_2]: 0.75, [idx.train]: 0.15, [idx.the_2]: 0.10 }),
  sparseTargets({ [idx.train]: 0.85, [idx.arrived_2]: 0.15 }),
  sparseTargets({ [idx.grew]: 0.60, [idx.brighter]: 0.30, [idx.station_2]: 0.10 }),
  sparseTargets({ [idx.brighter]: 0.70, [idx.grew]: 0.20, [idx.station_2]: 0.10 }),
  sparseTargets({ [idx.station_2]: 0.65, [idx.the_3]: 0.25, [idx.grew]: 0.10 }),
  sparseTargets({ [idx.only]: 0.45, [idx.then]: 0.35, [idx.did]: 0.20 }),
  sparseTargets({ [idx.only]: 0.70, [idx.then]: 0.20, [idx.did]: 0.10 }),
  sparseTargets({ [idx.break]: 0.55, [idx.out]: 0.25, [idx.did]: 0.20 }),
  sparseTargets({ [idx.panic]: 0.80, [idx.did]: 0.10, [idx.then]: 0.10 }),
  sparseTargets({ [idx.out]: 0.50, [idx.break]: 0.30, [idx.panic]: 0.20 }),
  sparseTargets({ [idx.break]: 0.45, [idx.out]: 0.35, [idx.panic]: 0.20 }),
  sparseTargets({ [idx.panic]: 0.70, [idx.break]: 0.20, [idx.out]: 0.10 })
];

const sequentialSteps = seqArabic.map((word, i) => ({
  outputWord: word,
  weights: sequentialWeights[i]
}));

// ---------- Attention Mapping (Global Aware) ----------
const attArabic = [
  "عندما","وصلتُ","إلى","المحطة،","لاحظتُ","رجلًا","يحمل","خفاشًا.",
  "لم","يُبدِ","أي","شخص","من","حولي","ردّ","فعل،","فافترضتُ","أن","الأمر",
  "عاديّ","ومن","الطبيعي","أن","يحمل","شيئًا","كهذا","هناك.","بقي","ثابتًا",
  "دون","حراك","لفترة","طويلة","جدًا.","ولم","يدرك","الناس","أنه","كان",
  "خفاشًا","حيًا","إلا","بعد","وصول","القطار","وازدياد","إضاءة","المحطة،",
  "وعندها","فقط","بدأ","الذعر","ينتشر","وعمّ","الهلع."
];

const attentionWeights: number[][] = [
  // Sentence 1
  sparseTargets({ [idx.When]: 0.7, [idx.It_2]: 0.08, [idx.wasnt]: 0.07, [idx.until]: 0.06, [idx.arrived_1]: 0.05, [idx.arrived_2]: 0.04 }),
  sparseTargets({ [idx.arrived_1]: 0.42, [idx.I_1]: 0.14, [idx.When]: 0.10, [idx.at]: 0.07, [idx.station_1]: 0.07, [idx.train]: 0.06, [idx.arrived_2]: 0.06, [idx.station_2]: 0.04, [idx.noticed]: 0.04 }),
  sparseTargets({ [idx.at]: 0.45, [idx.station_1]: 0.20, [idx.the_1]: 0.12, [idx.station_2]: 0.08, [idx.the_3]: 0.05, [idx.arrived_1]: 0.05, [idx.arrived_2]: 0.05 }),
  sparseTargets({ [idx.station_1]: 0.42, [idx.station_2]: 0.18, [idx.the_1]: 0.10, [idx.the_3]: 0.08, [idx.at]: 0.07, [idx.grew]: 0.06, [idx.brighter]: 0.05, [idx.arrived_2]: 0.04 }),
  sparseTargets({ [idx.noticed]: 0.48, [idx.I_2]: 0.12, [idx.I_1]: 0.08, [idx.I_3]: 0.08, [idx.assumed]: 0.08, [idx.reacted]: 0.05, [idx.man]: 0.04, [idx.holding_1]: 0.04, [idx.realized]: 0.03 }),
  sparseTargets({ [idx.man]: 0.52, [idx.a_1]: 0.10, [idx.holding_1]: 0.10, [idx.he]: 0.08, [idx.holding_2]: 0.08, [idx.people]: 0.04, [idx.realized]: 0.04, [idx.bat_1]: 0.02, [idx.bat_2]: 0.02 }),
  sparseTargets({ [idx.holding_1]: 0.36, [idx.holding_2]: 0.16, [idx.man]: 0.10, [idx.he]: 0.10, [idx.bat_1]: 0.10, [idx.bat_2]: 0.08, [idx.live]: 0.06, [idx.realized]: 0.04 }),
  sparseTargets({ [idx.bat_1]: 0.18, [idx.holding_1]: 0.12, [idx.man]: 0.08, [idx.live]: 0.14, [idx.bat_2]: 0.10, [idx.holding_2]: 0.08, [idx.realized]: 0.10, [idx.brighter]: 0.08, [idx.panic]: 0.06, [idx.people]: 0.04, [idx.station_2]: 0.02 }),
  // Sentence 2
  sparseTargets({ [idx.No]: 0.40, [idx.reacted]: 0.18, [idx.one]: 0.14, [idx.around]: 0.08, [idx.me]: 0.08, [idx.assumed]: 0.06, [idx.normal]: 0.04, [idx.people]: 0.02 }),
  sparseTargets({ [idx.reacted]: 0.45, [idx.No]: 0.12, [idx.one]: 0.10, [idx.around]: 0.10, [idx.me]: 0.08, [idx.assumed]: 0.06, [idx.so]: 0.05, [idx.normal]: 0.04 }),
  sparseTargets({ [idx.No]: 0.30, [idx.one]: 0.22, [idx.around]: 0.15, [idx.me]: 0.08, [idx.reacted]: 0.08, [idx.people]: 0.07, [idx.realized]: 0.05, [idx.panic]: 0.05 }),
  sparseTargets({ [idx.one]: 0.38, [idx.people]: 0.15, [idx.around]: 0.15, [idx.me]: 0.10, [idx.reacted]: 0.10, [idx.realized]: 0.06, [idx.panic]: 0.06 }),
  sparseTargets({ [idx.around]: 0.35, [idx.me]: 0.20, [idx.station_1]: 0.10, [idx.there]: 0.10, [idx.people]: 0.08, [idx.reacted]: 0.07, [idx.train]: 0.05, [idx.station_2]: 0.05 }),
  sparseTargets({ [idx.around]: 0.45, [idx.me]: 0.25, [idx.I_3]: 0.10, [idx.assumed]: 0.08, [idx.reacted]: 0.06, [idx.No]: 0.06 }),
  sparseTargets({ [idx.reacted]: 0.40, [idx.No]: 0.10, [idx.so]: 0.12, [idx.assumed]: 0.10, [idx.one]: 0.08, [idx.around]: 0.08, [idx.people]: 0.06, [idx.realized]: 0.06 }),
  sparseTargets({ [idx.reacted]: 0.30, [idx.so]: 0.18, [idx.assumed]: 0.14, [idx.No]: 0.10, [idx.one]: 0.08, [idx.around]: 0.08, [idx.people]: 0.06, [idx.realized]: 0.06 }),
  sparseTargets({ [idx.assumed]: 0.40, [idx.I_3]: 0.18, [idx.I_2]: 0.08, [idx.I_1]: 0.06, [idx.so]: 0.10, [idx.normal]: 0.08, [idx.carry]: 0.05, [idx.there]: 0.05 }),
  sparseTargets({ [idx.it_1]: 0.18, [idx.was_1]: 0.16, [idx.normal]: 0.15, [idx.to]: 0.12, [idx.carry]: 0.10, [idx.one_2]: 0.08, [idx.there]: 0.08, [idx.assumed]: 0.07, [idx.It_2]: 0.06 }),
  sparseTargets({ [idx.normal]: 0.22, [idx.it_1]: 0.14, [idx.was_1]: 0.12, [idx.assumed]: 0.14, [idx.No]: 0.10, [idx.reacted]: 0.10, [idx.carry]: 0.08, [idx.there]: 0.06, [idx.people]: 0.04 }),
  sparseTargets({ [idx.normal]: 0.30, [idx.No]: 0.14, [idx.reacted]: 0.12, [idx.assumed]: 0.12, [idx.one]: 0.08, [idx.around]: 0.08, [idx.carry]: 0.08, [idx.there]: 0.06, [idx.panic]: 0.02 }),
  sparseTargets({ [idx.so]: 0.22, [idx.normal]: 0.18, [idx.to]: 0.10, [idx.carry]: 0.16, [idx.one_2]: 0.10, [idx.there]: 0.12, [idx.assumed]: 0.06, [idx.around]: 0.06 }),
  sparseTargets({ [idx.normal]: 0.28, [idx.carry]: 0.18, [idx.there]: 0.12, [idx.one_2]: 0.10, [idx.assumed]: 0.10, [idx.No]: 0.08, [idx.reacted]: 0.06, [idx.station_1]: 0.04, [idx.station_2]: 0.04 }),
  sparseTargets({ [idx.to]: 0.32, [idx.carry]: 0.22, [idx.one_2]: 0.14, [idx.it_1]: 0.10, [idx.was_1]: 0.08, [idx.there]: 0.08, [idx.assumed]: 0.06 }),
  sparseTargets({ [idx.carry]: 0.30, [idx.holding_1]: 0.12, [idx.holding_2]: 0.10, [idx.one_2]: 0.14, [idx.bat_1]: 0.08, [idx.bat_2]: 0.08, [idx.live]: 0.06, [idx.there]: 0.06, [idx.assumed]: 0.06 }),
  sparseTargets({ [idx.one_2]: 0.22, [idx.bat_1]: 0.10, [idx.bat_2]: 0.08, [idx.carry]: 0.18, [idx.holding_1]: 0.10, [idx.holding_2]: 0.08, [idx.live]: 0.08, [idx.there]: 0.08, [idx.normal]: 0.08 }),
  sparseTargets({ [idx.bat_1]: 0.18, [idx.bat_2]: 0.10, [idx.carry]: 0.16, [idx.holding_1]: 0.12, [idx.holding_2]: 0.10, [idx.live]: 0.08, [idx.normal]: 0.10, [idx.there]: 0.08, [idx.assumed]: 0.08 }),
  sparseTargets({ [idx.there]: 0.50, [idx.station_1]: 0.12, [idx.station_2]: 0.08, [idx.carry]: 0.10, [idx.normal]: 0.08, [idx.around]: 0.06, [idx.train]: 0.04, [idx.arrived_2]: 0.02 }),
  // Sentence 3
  sparseTargets({ [idx.He]: 0.18, [idx.remained]: 0.42, [idx.still]: 0.10, [idx.completely]: 0.08, [idx.for]: 0.06, [idx.long]: 0.06, [idx.time]: 0.06, [idx.holding_2]: 0.02, [idx.realized]: 0.02 }),
  sparseTargets({ [idx.still]: 0.34, [idx.completely]: 0.18, [idx.remained]: 0.18, [idx.He]: 0.08, [idx.long]: 0.08, [idx.time]: 0.06, [idx.holding_2]: 0.04, [idx.bat_2]: 0.02, [idx.live]: 0.02 }),
  sparseTargets({ [idx.completely]: 0.28, [idx.still]: 0.22, [idx.remained]: 0.14, [idx.for]: 0.14, [idx.long]: 0.10, [idx.time]: 0.08, [idx.He]: 0.04 }),
  sparseTargets({ [idx.still]: 0.30, [idx.completely]: 0.18, [idx.long]: 0.16, [idx.time]: 0.14, [idx.remained]: 0.10, [idx.for]: 0.08, [idx.He]: 0.04 }),
  sparseTargets({ [idx.for]: 0.30, [idx.long]: 0.22, [idx.time]: 0.22, [idx.remained]: 0.10, [idx.still]: 0.08, [idx.completely]: 0.04, [idx.until]: 0.04 }),
  sparseTargets({ [idx.long]: 0.38, [idx.time]: 0.22, [idx.for]: 0.16, [idx.remained]: 0.10, [idx.still]: 0.08, [idx.completely]: 0.06 }),
  sparseTargets({ [idx.long]: 0.26, [idx.time]: 0.24, [idx.completely]: 0.14, [idx.still]: 0.12, [idx.remained]: 0.10, [idx.panic]: 0.06, [idx.brighter]: 0.04, [idx.live]: 0.04 }),
  // Sentence 4
  sparseTargets({ [idx.It_2]: 0.38, [idx.wasnt]: 0.22, [idx.until]: 0.18, [idx.realized]: 0.10, [idx.people]: 0.06, [idx.arrived_2]: 0.03, [idx.train]: 0.03 }),
  sparseTargets({ [idx.realized]: 0.45, [idx.people]: 0.18, [idx.that]: 0.10, [idx.he]: 0.08, [idx.holding_2]: 0.06, [idx.live]: 0.05, [idx.bat_2]: 0.04, [idx.panic]: 0.04 }),
  sparseTargets({ [idx.people]: 0.48, [idx.realized]: 0.22, [idx.panic]: 0.10, [idx.No]: 0.06, [idx.one]: 0.04, [idx.around]: 0.04, [idx.brighter]: 0.03, [idx.train]: 0.03 }),
  sparseTargets({ [idx.that]: 0.34, [idx.he]: 0.20, [idx.was_2]: 0.16, [idx.holding_2]: 0.10, [idx.realized]: 0.08, [idx.live]: 0.06, [idx.bat_2]: 0.06 }),
  sparseTargets({ [idx.was_2]: 0.36, [idx.he]: 0.16, [idx.holding_2]: 1.14, [idx.realized]: 0.10, [idx.live]: 0.08, [idx.bat_2]: 0.08, [idx.was_1]: 0.06, [idx.it_1]: 0.02 }),
  sparseTargets({ [idx.bat_2]: 0.18, [idx.live]: 0.16, [idx.holding_2]: 0.14, [idx.realized]: 0.12, [idx.panic]: 0.10, [idx.brighter]: 0.08, [idx.bat_1]: 0.10, [idx.holding_1]: 0.06, [idx.man]: 0.04, [idx.people]: 0.02 }),
  sparseTargets({ [idx.live]: 0.40, [idx.bat_2]: 0.18, [idx.holding_2]: 0.12, [idx.realized]: 0.10, [idx.panic]: 0.08, [idx.brighter]: 0.06, [idx.bat_1]: 0.04, [idx.holding_1]: 0.02 }),
  sparseTargets({ [idx.until]: 0.46, [idx.only]: 0.18, [idx.then]: 0.12, [idx.realized]: 0.10, [idx.arrived_2]: 0.08, [idx.train]: 0.06 }),
  sparseTargets({ [idx.until]: 0.30, [idx.train]: 0.18, [idx.arrived_2]: 0.18, [idx.brighter]: 0.10, [idx.station_2]: 0.08, [idx.realized]: 0.08, [idx.people]: 0.08 }),
  sparseTargets({ [idx.arrived_2]: 0.34, [idx.train]: 0.22, [idx.the_2]: 0.10, [idx.station_2]: 0.10, [idx.brighter]: 0.08, [idx.realized]: 0.08, [idx.until]: 0.08 }),
  sparseTargets({ [idx.train]: 0.52, [idx.arrived_2]: 0.18, [idx.station_2]: 0.10, [idx.brighter]: 0.08, [idx.people]: 0.06, [idx.panic]: 0.06 }),
  sparseTargets({ [idx.grew]: 0.30, [idx.brighter]: 0.22, [idx.station_2]: 0.16, [idx.people]: 0.08, [idx.realized]: 0.08, [idx.train]: 0.08, [idx.arrived_2]: 0.08 }),
  sparseTargets({ [idx.brighter]: 0.40, [idx.grew]: 0.18, [idx.station_2]: 0.16, [idx.people]: 0.08, [idx.realized]: 0.08, [idx.panic]: 0.06, [idx.train]: 0.04 }),
  sparseTargets({ [idx.station_2]: 0.36, [idx.grew]: 0.16, [idx.brighter]: 0.14, [idx.the_3]: 0.10, [idx.station_1]: 0.08, [idx.arrived_1]: 0.06, [idx.train]: 0.06, [idx.arrived_2]: 0.04 }),
  sparseTargets({ [idx.only]: 0.26, [idx.then]: 0.22, [idx.did]: 0.16, [idx.panic]: 0.12, [idx.realized]: 0.10, [idx.brighter]: 0.08, [idx.live]: 0.06 }),
  sparseTargets({ [idx.only]: 0.44, [idx.then]: 0.18, [idx.did]: 0.12, [idx.panic]: 0.12, [idx.realized]: 0.08, [idx.break]: 0.06 }),
  sparseTargets({ [idx.panic]: 0.22, [idx.break]: 0.26, [idx.out]: 0.18, [idx.did]: 0.14, [idx.only]: 0.10, [idx.then]: 0.10 }),
  sparseTargets({ [idx.panic]: 0.55, [idx.only]: 0.10, [idx.then]: 0.08, [idx.did]: 0.07, [idx.live]: 0.07, [idx.bat_2]: 0.05, [idx.realized]: 0.05, [idx.brighter]: 0.03 }),
  sparseTargets({ [idx.break]: 0.28, [idx.out]: 0.24, [idx.panic]: 0.18, [idx.people]: 0.10, [idx.realized]: 0.10, [idx.only]: 0.05, [idx.then]: 0.05 }),
  sparseTargets({ [idx.out]: 0.26, [idx.break]: 0.22, [idx.panic]: 0.20, [idx.people]: 0.12, [idx.realized]: 0.10, [idx.brighter]: 0.05, [idx.train]: 0.05 }),
  sparseTargets({ [idx.panic]: 0.50, [idx.break]: 0.20, [idx.out]: 0.15, [idx.people]: 0.07, [idx.realized]: 0.05, [idx.brighter]: 0.03 })
];

const attentionSteps = attArabic.map((word, i) => ({
  outputWord: word,
  weights: attentionWeights[i]
}));

export const EXAMPLES: ExampleSentence[] = [
  {
    id: 'sequential-fail',
    name: 'Local Attention',
    inputWords: inputWords,
    outputSteps: sequentialSteps
  },
  {
    id: 'attention-context',
    name: 'Attention is all you need',
    inputWords: inputWords,
    outputSteps: attentionSteps
  }
];
