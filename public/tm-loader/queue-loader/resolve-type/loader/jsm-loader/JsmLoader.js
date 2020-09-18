import { TmLoader } from '../../../../TmLoader.js';
import { QueueLoader } from '../../../QueueLoader.js';

export class JsmLoader {
  static load ({ item, state }) {
    console.log ('ITEM:', item);
    fetch (item.url)
      .then (res => res.text ())
      .then ((text) => {
        let acorn;

        acorn = TmLoader.find ('acorn');
        QueueLoader.increment ({ item, state });
      })
      .catch ((err) => {
        console.error (`ERROR: ${err.message}`);
        console.error (err);
      })
  }
}
