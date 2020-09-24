import { QueueLoader } from '../../../QueueLoader.js';

export class Transform {
  static import({ code, file = '', imports, state }) {
    let children, end, i, item, list, modified, statement, targets, vars;

    modified = code;
    targets = [];
    vars = [];
    children = [];

    list = imports;
    end = list.length - 1;
    for (i = end; i > -1; i--) {
      item = list[i];

      item.specifiers.forEach((target) => {
        // console.log(target);
        let child = {};
        child.local = target.local.name;
        if (target.imported && target.imported.name !== child.local) { child.name = target.imported.name; }

        targets.push (child);

        // if (target.imported.name) {
        //   targets.push(target.imported.name);
        // }
        // vars.push(target.local.name);
      });

      // Compile the children.
      targets.forEach((item) => {
        if (item.name) {
          children.push(`${item.name}: ${item.local}`);
        }
        else {
          children.push(`${item.local}`);
        }
      });

      // Create the final statement.
      statement = `const { ${children.join (', ')} } = await tml.import('${item.source.value}', module);`;

      modified = modified.slice(0, item.start) + statement + modified.slice(item.end);
    }

    modified = modified.slice(0, list[0].start) + modified.slice(list[0].start);

    // if (file) { file = `// file: ${file}`; }
    // if (!file) { file = ; }
// return `(function(){ const module = { exports: {}, file: '${file}' }; window.define (module.file, async function () {\n\n${mod}\n})})();`;

return `(async function () { const module = { exports: {}, file: '${file}' }

${modified}
window.define (module.file, function () { return module.exports; }); })();
`;

  }

  static export ({ code, file = '', result, state }) {
    let children, end, headerAdded, i, item, list, modified, node, statement, target;
    let block, key, value;

    modified = code;
    headerAdded = false;

    list = result;
    end = list.length - 1;
    for (i = end; i > -1; i--) {
      node = list[i];

      block = node.declaration;
      switch (block.type) {
        case 'ClassDeclaration':
          key = block.id.name;
          value = modified.slice(block.start, block.end);
          statement = `module.exports.${key} = ${value}; `;
          break;

        case 'VariableDeclaration':
          target = block.declarations[0];
          key = target.id.name;
          value = modified.slice(target.init.start, target.init.end);
          statement = `const ${key} = module.exports.${key} = ${value}; `;
          break;
      }

      modified = modified.slice(0, node.start) + statement + modified.slice(node.end);
    };

modified = modified.slice(0, list[0].start) + modified.slice(list[0].start);

    return modified;
  }
}

export class JsmLoader {
  static load ({ item, state }) {

    // tml.add({ item, state });

    fetch (item.url)
      .then (res => res.text ())
      .then ((code) => {
        let acorn = tml.require ('acorn');
        let { JSONPath } = tml.require ('json-path');
        let ast, match, regex, result;

        // Check if the js has ES6 import statements.
        regex = new RegExp (/import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/, 'g');
        match = code.match(regex);

        // Modify the ES6 code.
        if (match.length && item.module === 'virtual') {
          ast = acorn.parse (code, {
            ecmaVersion: 2020,
            sourceType: 'module',
          });

          // console.log (JSON.stringify(ast, null, 2));
          // result = JSONPath ({
          //   path: `$..body[?(@.type === 'ImportDeclaration')]`,
          //   json: ast,
          // });
          // console.log ('result:', result);

          code = Transform.export({
            code,
            file:
            item.url,
            result: JSONPath ({
              path: `$..body[?(@.type === 'ExportDefaultDeclaration' || @.type === 'ExportNamedDeclaration')]`,
              json: ast,
            }),
            state
          });

          code = Transform.import({
            code, file:
            item.url,
            imports: JSONPath ({
              path: `$..body[?(@.type === 'ImportDeclaration')]`,
              json: ast,
            }),
            state
          });

          console.log ('code:');
          console.log (code);
          console.log ('ITEM:', item);

          let dom = document.createElement('script');
          dom.download = 'Bobbby';
          dom.src = `data:text/javascript;charset=utf-8,`
            + encodeURIComponent(code);
          // dom.innerHTML = code;

          // dom.onreadystatechange = function () {
          dom.onload = function () {
            console.log ('**** BUT WHY ****');
            tml.add({ item, state });
          }

          document.body.appendChild(dom);
          return;
          // console.log (tml.require('Game.js'));
          // console.log (tml.get);
        }

        // const dataUri = 'data:text/javascript;charset=utf-8,'
        //   + encodeURIComponent(code);
        //
        // import(dataUri)
        //   .then((mod) => {
        //     console.log('MODULE:', mod, mod.NAME);
        //     Object.keys(mod).forEach((key) => {
        //       console.log(key, ':', mod[key]);
        //     })
        //   });
        tml.add({ item, state });
        // QueueLoader.increment ({ item, state });
      })
      .catch ((err) => {
        console.error (`ERROR: ${err.message}`);
        console.error (err);
      })
  }
}

// document.write(`<script src='${item.url}' type='module'></script>`);
// fetch('/static/bob.js');

// let dom = document.createElement('script');
// dom.type = 'module';
// dom.src = item.url;
// document.body.appendChild(dom);


// console.log (result [0]);



// JSONPath.JSONPath({
//   path: `$..body[?(@.type === 'ImportDeclaration')]`,
//   json: result.ast
// });

// let dom = document.createElement('script');
// dom.type = 'module';
// dom.innerHTML = code;
// document.body.appendChild(dom);

// document.write(`<script src='${item.url}' type='module'></script>`);

// const dataUri = 'data:text/javascript;charset=utf-8,'
//   + encodeURIComponent(code);
//
// import(dataUri)
//   .then((mod) => {
//     console.log(mod.default, 'Returned value');
//   });
