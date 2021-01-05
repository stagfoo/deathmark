import page from 'page';
import { state } from './index';

type Context = {
  params: {
    name?: string;
  };
};

// Handlers
const HOME_PAGE = (ctx: Context, next: any) => {
  state._update('updateCurrentPage', 'HOME')

};


// Routes
page('/', HOME_PAGE);

export function startRouters(): void {
  page.start();
}

//Network Call
const API = {
  JSON: window.location.origin
}
export async function getData(name: string) {
  const resp = await fetch(`${API.JSON}/data.json`);
  if (resp.ok) {
    return resp.json();
  } else throw new TypeError('getData response is not Ok');
}
