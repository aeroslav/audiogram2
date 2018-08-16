import { Store } from "svelte/store.js";

const FREQUENCIES_SETS_URL = 'frequencies-sets.json';

export class Model {
  constructor() {
    this.store = new Store({
      loadedSets: [],
      chosenStep: null,
      steps: [],
      currentStep: null,
      isPlaying: false
    });
    this.store.compute(
      'sets',
      ['loadedSets'],
      (sets) => sets.reduce((str, set) => (`${str} ${set.name}`), '')
    )
    window.store = this.store;

    this.loadSets();
  }

  loadSets() {
    fetch(FREQUENCIES_SETS_URL)
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.store.set({loadedSets: json})
      })
      .catch(err => {
        console.log(err);
      });
  }
}
