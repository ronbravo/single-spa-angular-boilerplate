export class ModuleLoader {
  static load() {}

  static loadFromString({ code }) {
    const encodedJs = encodeURIComponent(code);
    const dataUri = 'data:text/javascript;charset=utf-8,'
      + encodedJs;

    import(dataUri);
    import(dataUri)
      .then((namespace) => {
        console.log('HERE:', namespace.default);
      });
  }
}
