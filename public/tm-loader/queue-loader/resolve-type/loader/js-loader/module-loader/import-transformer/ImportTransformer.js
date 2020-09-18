// export class ImportTransfomer extends Base {

export class ImportTransfomer {
  /**
   * Modify the provided source code with a list of import statements to use the TamedJs loader.
   *
   * @param  {String} data.code The source code being transformed.
   * @param  {String} data.imports A list of import statements.
   *
   * @param  {Object} result The results of processing the message.
   * @param  {State} state The state of the target object.
   * @return {Message} A generic message object.
   */
  static onParse({ data, result, state }) {
    let msg = arguments[0];

    result.code = data.code;
    result.imports = [];

    // Process the message
    try {
      result.ast = acorn.parse(data.code, { sourceType: 'module' });
      result.imports = JSONPath.JSONPath({
        path: `$..body[?(@.type === 'ImportDeclaration')]`,
        json: result.ast
      });
    }
    catch (err) {
      throw new Error('Unable to parse provided Javascript code.');
      console.error(err);
    }

    // Return the message.
    return msg;
  }

  /**
   * Modify the provided source code with a list of import statements to use the TamedJs loader.
   *
   * @param  {State} state
   * @param  {String} code The source code to transform.
   * @param  {Array} imports A list of import statements.
   * @return {String} The modified source code.
   */
  static modifyCode({ state, code, imports }) {
    let end, i, item, list, mod, targets, vars;

    mod = code;
    targets = [];
    vars = [];

    list = imports;
    end = list.length - 1;
    for (i = end; i > -1; i--) {
      item = list[i];

      item.specifiers.forEach((target) => {
        targets.push(target.imported.name);
        vars.push(target.local.name);
      });

      const statement = `const { ${vars.join(', ')} } = await tm.import({ targets: [ ${targets.join(', ')} ], from: '${item.source.value}' });`;
      mod = mod.slice(0, item.start) + statement + mod.slice(item.end);
    }
    return mod;
  }

  /**
   * Generate an AST for ES6 code to be modified by a Loader plugin.
   * @param  {Object} state [description]
   * @param  {String} code  [description]
   * @return {Object} An object containing the code and list of import statements.
   */
  static parseCode({ state, code }) {
    let ast, result;

    result = {
      code,
      imports: []
    };
    try {
      ast = acorn.parse(code, { sourceType: 'module' });
      result.imports = JSONPath({
        path: `$..body[?(@.type === 'ImportDeclaration')]`,
        json: ast
      });
    }
    catch (err) {
      throw new Error('Unable to parse provided Javascript code.');
    }
    return result;
  }
}
