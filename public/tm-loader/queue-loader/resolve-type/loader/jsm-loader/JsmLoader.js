import { QueueLoader } from '../../../QueueLoader.js';

export class JsmLoader {
  static load ({ item, state }) {
    fetch (item.url)
      .then (res => res.text ())
      .then ((code) => {
        let acorn = tml.require ('acorn');
        let { JSONPath } = tml.require ('json-path');
        let ast, result;

        ast = acorn.parse (code, {
          ecmaVersion: 2020,
          sourceType: 'module',
        });
        console.log (JSON.stringify(ast, null, 2));

        result = JSONPath ({
          path: `$..body[?(@.type === 'ImportDeclaration')]`,
          json: ast,
        });
        console.log ('result:', result);

        code = JsmLoader.modify({ code, file: item.url, imports: result, state })
        // console.log ('code:');
        // console.log (code);
        const dataUri = 'data:text/javascript;charset=utf-8,'
          + encodeURIComponent(code);

        import(dataUri)
          .then((mod) => {
            // console.log(mod.default, 'Returned value');
          });

        QueueLoader.increment ({ item, state });
      })
      .catch ((err) => {
        console.error (`ERROR: ${err.message}`);
        console.error (err);
      })
  }

  static modify({ code, file = '', imports, state }) {
    let children, end, i, item, list, mod, targets, vars;

    mod = code;
    targets = [];
    vars = [];
    children = [];

    list = imports;
    end = list.length - 1;
    for (i = end; i > -1; i--) {
      item = list[i];

      item.specifiers.forEach((target) => {
        console.log(target);
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
      const statement = `const { ${children.join (', ')} } = await tml.import('${item.source.value}');`;
      mod = mod.slice(0, item.start) + statement + mod.slice(item.end);
    }

    if (file) { file = `// file: ${file}`; }
    return `${file}\n(async function () {\n\n${mod}\n}) ();`;
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
