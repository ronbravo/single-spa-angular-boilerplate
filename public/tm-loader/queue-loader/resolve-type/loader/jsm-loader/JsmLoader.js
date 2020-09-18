import { QueueLoader } from '../../../QueueLoader.js';

export class JsmLoader {
  static load ({ item, state }) {
    fetch (item.url)
      .then (res => res.text ())
      .then ((code) => {
        let acorn, ast;

        acorn = tml.require ('acorn');
        ast = acorn.parse (code, {
          ecmaVersion: 2020,
          sourceType: 'module',
        });
        console.log ('ast:', ast);

        QueueLoader.increment ({ item, state });
      })
      .catch ((err) => {
        console.error (`ERROR: ${err.message}`);
        console.error (err);
      })
  }
}
