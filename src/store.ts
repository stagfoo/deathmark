import {reducer} from 'obake.js';

export interface State {
  currentPage: string,
  currentGame: 'valorant' | 'outward',
  processorStart: boolean,
  isScanning: boolean,
  deathmarks: any[],
  currentProject: Project,
  projects: any[]
  currentDatabase: {
    filename: string,
    deathmarks: any[]
  }
  _update: Update
  _?: { name:string, value:unknown }
}
export interface Project {
  id: string,
  createdAt: number,
  filename: string,
  deathmarks: any[]
}

const CurrentDatabase = {
  filename: '',
  projects: [],
};

export const defaultState = {
  currentPage: 'home',
  currentGame: 'valorant',
  processorStart: false,
  isScanning: false,
  projects: [],
  currentProject: {
    id: '',
    createdAt: '',
    deathmarks: [],
    filename: '',
  },
};

export const reducers = {
  updateCurrentGame: reducer((state: State, value:Games) => {
    state.currentGame = value;
  }),
  updateCurrentPage: reducer((state: State, value:string) => {
    state.currentPage = value;
  }),
  updateCurrentProject: reducer((state: State, value:Project) => {
    state.currentProject = value;
  }),
  updateDeathMarkers: reducer((state: State, value:any[]) => {
    state.currentProject.deathmarks = value;
  }),
  updateScanStatus: reducer((state: State, value:boolean) => {
    state.isScanning = value;
  }),
  processorStart: reducer((state: State, value:boolean) => {
    state.processorStart = value;
  }),
};
