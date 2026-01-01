
export interface AttentionStep {
  outputWord: string;
  weights: number[]; // Index aligns with inputWords array
}

export interface ExampleSentence {
  id: string;
  name: string;
  inputWords: string[];
  outputSteps: AttentionStep[];
}
