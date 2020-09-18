export class CssLoader {
  static load({ item, state }) {
    fetch(item.url)
      .then(resp => resp.text())
      .then((text) => {
        let dom;

        dom = document.createElement('style');
        dom.innerHTML = text;
        dom.type = 'text/css';
        dom.rel = 'stylesheet';
        CssLoader.getParentDom().appendChild(dom);
        tmls.add({ item, mod: text, state });
      });
  }

  static getParentDom() {
    let dom, id;

    id = 'tm-loader-styles';
    dom = document.querySelector(`#${id}`);
    if (!dom) {
      dom = document.createElement('div');
      dom.id = id;
      document.body.appendChild(dom);
    }
    return dom;
  }
}
