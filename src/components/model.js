import isNumber from 'lodash/isNumber';
import { Store } from "svelte/store.js";

const FREQUENCIES_SETS_URL = 'frequencies-sets.json';
const INITITAL_STATE = {
  loadedSets: [],
  currentSetIndex: null,
  currentStepIndex: null,
  isPlaying: false,
  volume: 10
};

export class Model extends Store {
  constructor() {
    super();
    window.store = () => (this.get());

    this.set(INITITAL_STATE);

    this.compute(
      'steps',
      ['loadedSets', 'currentSetIndex'],
      (loadedSets, currentSetIndex) => (
        (
          isNumber(currentSetIndex) && loadedSets && 
          loadedSets[currentSetIndex] &&
          loadedSets[currentSetIndex].frequencies
        ) || ([])
      )
    );

    this.compute(
      'hz',
      ['loadedSets', 'currentSetIndex', 'currentStepIndex'],
      (loadedSets, currentSetIndex, currentStepIndex) => {
        const frequencies = isNumber(currentSetIndex) &&
          loadedSets && 
          loadedSets[currentSetIndex] &&
          loadedSets[currentSetIndex].frequencies;
        return (
          frequencies &&
          isNumber(currentStepIndex) &&
          frequencies[currentStepIndex]
        );
      }
    );
  }

  loadSets() {
    return fetch(FREQUENCIES_SETS_URL)
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.set({loadedSets: json})
      })
      .catch(err => {
        console.log(err);
      });
  }

  chooseSet(index) {
    const chosenStep = this.get().loadedSets[index];
    if (chosenStep && chosenStep.frequencies) {
      this.set({ currentSetIndex: index });
    }
  }

  playFrequency(stepIndex) {
    const {currentStepIndex, isPlaying} = this.get();
    this.set({currentStepIndex: stepIndex});
    const isNowPlaying = (currentStepIndex === stepIndex
      ? !isPlaying
      : true);
    this.set({ isPlaying: isNowPlaying });
  };
}
