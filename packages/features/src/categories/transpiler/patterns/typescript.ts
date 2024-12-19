export const typescript = [
  {
    name: 'core' as const,
    score: 1,
    runtime: [
      // TypeScript's unique generator implementation
      /function\s*__generator\s*\(thisArg,\s*body\)\s*\{\s*var\s*_\s*=\s*\{\s*label:\s*0,\s*sent:\s*function\(\)\s*\{\s*if\s*\(t\[0\]\s*&\s*1\)/,

      // TypeScript's unique async/await implementation
      /function\s*__await\s*\(v\)\s*\{\s*return\s*this\s*instanceof\s*__await\s*\?\s*\(this\.v\s*=\s*v,\s*this\)\s*:\s*new\s*__await\s*\(v\)\s*\}/,

      // TypeScript's specific array spread implementation
      /function\s*__spreadArray\s*\(to,\s*from,\s*pack\)\s*\{\s*if\s*\(pack\s*\|\|\s*arguments\.length\s*===\s*2\)\s*for\s*\(var\s*i\s*=\s*0,\s*l\s*=\s*from\.length,\s*ar;\s*i\s*<\s*l;\s*i\+\+\)/,

      // TypeScript's unique read helper
      /function\s*__read\s*\(o,\s*n\)\s*\{\s*var\s*m\s*=\s*typeof\s*Symbol\s*===\s*"function"\s*&&\s*o\[Symbol\.iterator\];?\s*if\s*\(!m\)\s*return\s*o;/,
    ],
  },
  {
    name: 'decoratorsAndMetadata' as const,
    score: 1,
    runtime: [
      // TypeScript's unique decorator implementation
      /function\s*__decorate\s*\(decorators,\s*target,\s*key,\s*desc\)\s*\{\s*var\s*c\s*=\s*arguments\.length,\s*r\s*=\s*c\s*<\s*3\s*\?\s*target/,

      // TypeScript's specific metadata implementation
      /function\s*__metadata\s*\(metadataKey,\s*metadataValue\)\s*\{\s*if\s*\(typeof\s*Reflect\s*===\s*"object"\s*&&\s*typeof\s*Reflect\.metadata\s*===\s*"function"\)/,

      // TypeScript's parameter decorator helper
      /function\s*__param\s*\(paramIndex,\s*decorator\)\s*\{\s*return\s*function\s*\(target,\s*key\)\s*\{\s*decorator\(target,\s*key,\s*paramIndex\);?\s*\}/,
    ],
  },
  {
    name: 'moduleSystem' as const,
    score: 1,
    runtime: [
      // TypeScript's unique module helpers
      /function\s*__createBinding\s*\(o,\s*m,\s*k,\s*k2\)\s*\{\s*if\s*\(k2\s*===\s*undefined\)\s*k2\s*=\s*k;?\s*(?:var\s*desc|Object\.defineProperty)/,

      // TypeScript's specific import helpers
      /function\s*__importStar\s*\(mod\)\s*\{\s*if\s*\(mod\s*&&\s*mod\.__esModule\)\s*return\s*mod;\s*var\s*result\s*=\s*\{\};?\s*if\s*\(mod\s*!=\s*null\)/,

      // TypeScript's unique export star helper
      /function\s*__exportStar\s*\(m,\s*o\)\s*\{\s*for\s*\(var\s*p\s*in\s*m\)\s*if\s*\(p\s*!==\s*"default"\s*&&\s*!\s*Object\.prototype\.hasOwnProperty\.call\(o,\s*p\)\)/,
    ],
  },
];
