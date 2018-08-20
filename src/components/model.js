import isNumber from 'lodash/isNumber';
import { Store } from "svelte/store.js";

const FREQUENCIES_SETS_URL = 'frequencies-sets.json';
const DEFAULT_VOLUME = 10;
const INITITAL_STATE = {
  loadedSets: [],
  currentSetIndex: null,
  currentStepIndex: null,
  isPlaying: false,
  results: {}
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
    const { loadedSets, results } = this.get();
    const chosenStep = loadedSets[index];
    if (chosenStep && chosenStep.frequencies) {
      this.set({
        currentSetIndex: index
      });
      if (!results[index]) {
        this.set({
          results: {
            [index]: new Array(chosenStep.frequencies.length).fill(DEFAULT_VOLUME)
          }
        });
      }
    }
  }

  playFrequency(stepIndex) {
    const {currentStepIndex, isPlaying} = this.get();
    this.set({currentStepIndex: stepIndex});
    const isNowPlaying = (currentStepIndex === stepIndex
      ? !isPlaying
      : true);
    this.set({ isPlaying: isNowPlaying });
  }

  setVolume(vol) {
    const { results, currentSetIndex, currentStepIndex } = this.get();
    const volumes = results[currentSetIndex];
    const updatedVolumes = [].concat(volumes);

    vol = +vol;
    updatedVolumes.splice(currentStepIndex, 1, vol);

    isNumber(vol) && this.set({
      results: {
        [currentSetIndex]: updatedVolumes
      }
    });
  }
}
