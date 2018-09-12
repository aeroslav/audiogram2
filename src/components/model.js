import isNumber from 'lodash/isNumber';
import { Store } from "svelte/store.js";
import { DEFAULT_VOLUME } from '../scripts/constants';

const INITITAL_STATE = {
  loadedSets: [],
  setI: null,
  stepI: null,
  isPlaying: false,
  results: {},
  modals: {
    help: false,
    export: false
  }
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

  chooseSet(index) {
    const { loadedSets, results } = this.get();
    let newState = {};
    if (isNumber(index) && index > -1) {
      const chosenStep = loadedSets[index];
      newState = {
        setI: index,
        stepI: null
      };
      if (!results[index]) {
        newState = {
          ...newState,
          results: {
            ...results,
            [index]: new Array(chosenStep.frequencies.length).fill(null)
          }
        };
      }
    } else {
      newState = {
        setI: null,
        stepI: null
      }
    }
    this.set(newState);
  }

  playFrequency(stepIndex, vol) {
    const {stepI, isPlaying, results, setI} = this.get();
    const isNowPlaying = (stepI === stepIndex
      ? !isPlaying
      : true);
    this.set({ stepI: stepIndex || 0 });
    this.setVolume(vol || results[setI][stepIndex] || DEFAULT_VOLUME);
    this.set({ isPlaying: isNowPlaying });
  }

  setVolume(vol) {
    const { results, setI, stepI } = this.get();
    const volumes = results[setI];
    const updatedVolumes = [].concat(volumes);

    vol = +vol;
    updatedVolumes[stepI] = vol;

    isNumber(vol) && this.set({
      results: {
        [setI]: updatedVolumes
      }
    });
  }

  toggleModal(name, state) {
    if (!name) { console.warn('Specify modal name'); return; }
    const { modals } = this.get();
    const newState = typeof state === 'boolean'
      ? state
      : !modals[name];
    this.set({
      modals: {
        ...modals,
        [name]: newState
      }
    });
  }
}
