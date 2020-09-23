import { Player, Health as Bob } from '@project/player';

if (Player.speed > 0) {
  console.log ('How did player speed up?');
}

console.log (Player);
console.log (Bob);

setTimeout(() => {
  EVENT_JUMP();
});

// TODO: Create a test for the regex on different import statements:
// https://regexr.com/47jlq

export class Enemy {}
export const PLAYER_ID = 12345;
export const PLAYER_NAME = 'Bob';

export const EVENT_JUMP = () => {
  console.log ('Doing something...')
}
