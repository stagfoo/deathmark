function onClickHome() {
  state._update("updateDeathMarkers", []);
  state._update("updateCurrentPage", "home");
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
  let found = -1;
  projects.map((item, i) => {
    if (name === item.filename) {
      found = i;
    }
  });
  console.log("name", name, projects[found]);
  if (found >= 0) {
    const project = projects[found];
    state._update("updateDeathMarkers", project.deathmarks);
    state._update("updateMachineState", {
      projects: state.machineState.projects,
      filename: name,
    });
    syncState()
    state._update("updateCurrentPage", "project");
  }
}

function saveProject() {
  const projects = state.machineState.projects;
  const name = state.machineState.filename;
  let found = -1;
  projects.map((item, i) => {
    if (name === item.filename) {
      found = i;
    }
  });
  if (found >= 0) {
    console.log('saving...', projects[found], state.deathmarks)
    ipcRenderer.send("@save-project", {
      ...projects[found],
      deathmarks: state.deathmarks,
    });
  } else {
    console.log('save failed')
  }
}

function onClickOpenProject(name) {
  state._update();
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
