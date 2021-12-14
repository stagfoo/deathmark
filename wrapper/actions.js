function onClickHome() {
  saveProject()
  state._update("updateDeathMarkers", []);
  state._update("updateCurrentPage", "home");
  state._update('processorStart', false)
}
function onClickDeleteProject(item){
  if(confirm("are you sure you want to delete this project?")){
    ipcRenderer.send("@delete-project", item)
  }
}

function onClickCreateProject() {
  state._update("updateMachineState", {
    ...defaultMachineState,
    projects: state.machineState.projects,
  });
  state._update("updateCurrentPage", "project");
}

function onClickLoadProject(name) {
  const projects = state.machineState.projects;
  const result = getProject(projects, name)
  if(result.status){
    const project = projects[result.value];
    state._update("updateDeathMarkers", project.deathmarks);
    state._update("updateMachineState", {
      projects: state.machineState.projects,
      filename: name,
    });
    state._update("updateCurrentPage", "project");
  } else {
    alert('That file already in a project or failed to open')
  }
}

function getProject(projects, filename){
  let found = -1;
  projects.map((item, i) => {
    if (filename === item.filename) {
      found = i;
    }
  });
  if (found >= 0) {
    return {
      status: true,
      value: found
    }
  } else {
    return {
      status: false,
      value: -1
    }
  }
}


function saveProject() {
  const projects = state.machineState.projects;
  const name = state.machineState.filename;
  const result = getProject(projects, name)
  if(result.status){
    ipcRenderer.send("@save-project", {
      ...projects[result.found],
      filename: name,
      game: state.currentGame,
      deathmarks: state.deathmarks,
    });
  } else {
    // console.log('found failed')
  }
}

function manualDeathMark(){
  document.querySelector('video').pause()
  const mark = document.querySelector('video').currentTime
  const nextMarks = [...state.deathmarks, mark];
  state._update("updateDeathMarkers",nextMarks);
  saveProject()
}

function deleteDeathMark(n){
  const nextMarks = state.deathmarks.filter(v => {
    return v !== n;
  })
  state._update("updateDeathMarkers",nextMarks);
}

function syncState() {
  ipcRenderer.send("@save-state", JSON.stringify(state.machineState));
}

function onClickOpenVideo() {
  ipcRenderer.send("@click", { action: "open-file" });
  syncState();
}

function playVideo() {
  document.querySelector("video").play();
}
function stopVideo() {
  document.querySelector("video").pause();
}

function setCurrentGame(value){
  state._update("updateCurrentGame", value)
  syncState();
}

function getTitle(filename) {
  if (filename !== "" && filename !== undefined) {
    const name = filename.split(".");
    const _name = name[0].split("/");
    return _name[_name.length - 1];
  } else {
    return "";
  }
}

function onClickDonate() {
  shell.openExternal("https://ko-fi.com/H2H616GHW");
}
