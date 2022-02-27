declare module 'obake.js';
declare module 'nanomorph';
declare module 'joro';
declare module 'page';
declare module 'slugid';

type Update = (_name: string, payload: unknown) => void;
type Games = 'valorant' | 'outward';

interface PyviewResponse {
  message: string;
  data: any;
}

interface Frames {
  [x: number]: { r: number; g: number; b: number }[];
}

interface Processors {
  [x: 'valorant']: Processor;
  [x: 'outward']: Processor;
}

interface VideoExtra {
  videoWidth: number;
  videoHeight: number;
}

interface Processor {
  width: number;
  height: number;
  video: HTMLVideoElement | null;
  c1: HTMLCanvasElement | null;
  ctx1: CanvasRenderingContext2D | null;
  c2: HTMLCanvasElement | null;
  ctx2: CanvasRenderingContext2D | null;
  doLoad: () => void | null;
  timerCallback: () => void | null;
  computeFrame: () => void | null;
}

interface Pywebview {
  api: {
    findFile: () => Promise<PyviewResponse>;
    openFile: (filename: string) => Promise<PyviewResponse>;
    readDatabase: () => Promise<PyviewResponse>;
    saveDatabase: () => Promise<PyviewResponse>;
    exportProject: () => Promise<PyviewResponse>;
    saveCurrentProject: (currentProject: Project) => Promise<PyviewResponse>;
    openExternalUrl: (path: string) => Promise<PyviewResponse>;
  };
}

interface Window {
  pywebview: Pywebview;
}
