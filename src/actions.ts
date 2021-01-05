import { state } from './index';

export function handleGreetingClick() {
  // state._update('updateGreeting', state.greeting + '🍖')
};

export function scrubTo(v:number){
  const vid = document.getElementById('video');
  (vid as any).currentTime = v
}