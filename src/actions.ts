import {Project} from './store';
import {state} from 'index';
import slugid from 'slugid';

import {outwardProcessor} from 'games/outward';
import {valorantProcessor} from 'games/valorant';

const videoProcessors = {
  outward: outwardProcessor(saveProject),
  valorant: valorantProcessor(saveProject),
};

const {pywebview} = (window as Window);

export function onClickHome() {
  saveProject();
  state._update('updateDeathMarkers', []);
  state._update('updateCurrentPage', 'home');
  state._update('processorStart', false);
}

export function onClickDeleteProject(item: unknown) {
  if (confirm('are you sure you want to delete this project?')) {
    console.log(item);
    // TODO Delete Item
  }
}

export function onClickCreateProject() {
  state._update('updateCurrentPage', 'project');
}

export function onClickLoadProject(name: string) {
  const {projects} = state;
  const result = getProject(projects, name);
  if (result.status) {
    const project = projects[result.value];
    state._update('updateCurrentProject', project);
    state._update('updateDeathMarkers', project.deathmarks);
    state._update('updateCurrentPage', 'project');
  } else {
    alert('That file already in a project or failed to open');
  }
}

export function getProject(projects: { filename: string; }[], filename: string) {
  let found = -1;
  // TODO replace with different loop
  projects.map((item: { filename: string; }, i: number) => {
    if (filename === item.filename) {
      found = i;
    }

    return found;
  });
  if (found >= 0) {
    return {
      status: true,
      value: found,
    };
  }

  return {
    status: false,
    value: -1,
  };
}

export function saveProject() {
  console.log('@save-db', state.currentProject);
}

export function manualDeathMark() {
  const video = document.querySelector('video');
  if (video) {
    video.pause();
    const mark = video.currentTime;
    const nextMarks = [...state.deathmarks, mark];
    state._update('updateDeathMarkers', nextMarks);
    saveProject();
  }
}

export function deleteDeathMark(n: string) {
  const nextMarks = state.deathmarks.filter((v: string) => v !== n);
  state._update('updateDeathMarkers', nextMarks);
}

export function onClickOpenVideo() {
  window.pywebview.api.findFile().then((res: PyviewResponse) => {
    state._update('updateCurrentProject', createNewProject(res.data[0]));
  });
}

export function playVideo() {
  const video = document.querySelector('video');
  if (video) {
    video.play();
  } else {
    console.log('@playVideo', 'failed to play video');
  }
}

export function stopVideo() {
  const video = document.querySelector('video');
  if (video) {
    video.pause();
  } else {
    console.log('@playVideo', 'failed to play video');
  }
}

export function setCurrentGame(value: string) {
  state._update('updateCurrentGame', value);
}

export function getTitle(filename: string) {
  if (filename !== '' && filename !== undefined) {
    const name = filename.split('.');
    const _name = name[0].split('/');
    return _name[_name.length - 1];
  }

  return '';
}

export function onClickDonate() {
  pywebview.api.openExternalUrl('https://ko-fi.com/H2H616GHW');
}

// UTILS
export function secondsToHms(d: string) {
  const _d = Number(d);
  const h = Math.floor(_d / 3600);
  const m = Math.floor((_d % 3600) / 60);
  const s = Math.floor((_d % 3600) % 60);

  const hDisplay = h + (h === 1 ? ':' : ':');
  const mDisplay = m + (m === 1 ? ':' : ':');
  const sDisplay = s + (s === 1 ? '' : '');
  return hDisplay + mDisplay + sDisplay;
}

export function scrubTo(v: string) {
  const video = document.getElementById('video');
  if (video) {
    (video as any).currentTime = v;
  }
}

export function createNewProject(nextFilename: string): Project {
  return {
    id: slugid.nice(),
    createdAt: new Date().valueOf(),
    filename: nextFilename,
    deathmarks: [],
  };
}

export function openFile() {
  pywebview.api.findFile().then((res: PyviewResponse) => {
    console.log('@onClickOpenVideo', res);
  });

  // Open File Dialog
  // Get Filename
  // check if project exits
  // If it doesnt
  // createNewProject
  // save data to file
  // if CANCELLED
  // set blank filename
}

export function projectExists(filename: string) {
  let found = -1;
  state.projects.map((item: { filename: string; }, i: number) => {
    if (filename === item.filename) {
      found = i;
    }

    return found;
  });
  if (found >= 0) {
    return {
      index: found,
      status: true,
    };
  }

  return {
    index: -1,
    status: false,
  };
}

export function saveCurrentProjectToFile(project: Project) {
  pywebview.api.saveCurrentProject(project).then(res => {
    console.log('@saveCurrentProjectToFile', res);
  });
}

export function startProcessor() {
  if (!state.processorStart) {
    console.log(state);
    videoProcessors[state.currentGame].doLoad();
    state._update('processorStart', true);
  }
}

export function handleAppReady() {
  // Get Database file location
  // get json
  // create database with loaded data (if its exists)
}
