import isNumber from 'lodash/isNumber';
import { Store } from "svelte/store.js";

const FREQUENCIES_SETS_URL = 'frequencies-sets.json';
const DEFAULT_VOLUME = 10;
const INITITAL_STATE = {
  loadedSets: [],
  setI: null,
  stepI: null,
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
      ['loadedSets', 'setI'],
      (loadedSets, setI) => (
        (
          isNumber(setI) && loadedSets && 
          loadedSets[setI] &&
          loadedSets[setI].frequencies
        ) || ([])
      )
    );

    this.compute(
      'hz',
      ['loadedSets', 'setI', 'stepI'],
      (loadedSets, setI, stepI) => {
        const frequencies = isNumber(setI) &&
          loadedSets && 
          loadedSets[setI] &&
          loadedSets[setI].frequencies;
        return (
          frequencies &&
          isNumber(stepI) &&
          frequencies[stepI]
        );
      }
    );

    this.compute(
      'volume',
      ['results', 'setI', 'stepI'],
      (results, setI, stepI) => {
        return (
          results[setI] &&
          results[setI][stepI]
          || 0
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
        setI: index
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
    const {stepI, isPlaying} = this.get();
    const isNowPlaying = (stepI === stepIndex
      ? !isPlaying
      : true);
    this.set({
      isPlaying: isNowPlaying,
      stepI: stepIndex
    });
  }

  setVolume(vol) {
    const { results, setI, stepI } = this.get();
    const volumes = results[setI];
    const updatedVolumes = [].concat(volumes);

    vol = +vol;
    updatedVolumes.splice(stepI, 1, vol);

    isNumber(vol) && this.set({
      results: {
        [setI]: updatedVolumes
      }
    });
  }
}
