(self["webpackJsonp"] = self["webpackJsonp"] || []).push([[53],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/rust/rust.js":
/*!************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/rust/rust.js ***!
  \************************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"conf\", function() { return conf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"language\", function() { return language; });\n/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\nvar conf = {\n    comments: {\n        lineComment: '//',\n        blockComment: ['/*', '*/']\n    },\n    brackets: [\n        ['{', '}'],\n        ['[', ']'],\n        ['(', ')']\n    ],\n    autoClosingPairs: [\n        { open: '[', close: ']' },\n        { open: '{', close: '}' },\n        { open: '(', close: ')' },\n        { open: \"'\", close: \"'\", notIn: ['string', 'comment'] },\n        { open: '\"', close: '\"', notIn: ['string'] }\n    ],\n    surroundingPairs: [\n        { open: '{', close: '}' },\n        { open: '[', close: ']' },\n        { open: '(', close: ')' },\n        { open: '\"', close: '\"' },\n        { open: \"'\", close: \"'\" }\n    ],\n    folding: {\n        markers: {\n            start: new RegExp('^\\\\s*#pragma\\\\s+region\\\\b'),\n            end: new RegExp('^\\\\s*#pragma\\\\s+endregion\\\\b')\n        }\n    }\n};\nvar language = {\n    tokenPostfix: '.rust',\n    defaultToken: 'invalid',\n    keywords: [\n        'as',\n        'box',\n        'break',\n        'const',\n        'continue',\n        'crate',\n        'else',\n        'enum',\n        'extern',\n        'false',\n        'fn',\n        'for',\n        'if',\n        'impl',\n        'in',\n        'let',\n        'loop',\n        'match',\n        'mod',\n        'move',\n        'mut',\n        'pub',\n        'ref',\n        'return',\n        'self',\n        'static',\n        'struct',\n        'super',\n        'trait',\n        'true',\n        'type',\n        'unsafe',\n        'use',\n        'where',\n        'while',\n        'catch',\n        'default',\n        'union',\n        'static',\n        'abstract',\n        'alignof',\n        'become',\n        'do',\n        'final',\n        'macro',\n        'offsetof',\n        'override',\n        'priv',\n        'proc',\n        'pure',\n        'sizeof',\n        'typeof',\n        'unsized',\n        'virtual',\n        'yield'\n    ],\n    typeKeywords: [\n        'Self',\n        'm32',\n        'm64',\n        'm128',\n        'f80',\n        'f16',\n        'f128',\n        'int',\n        'uint',\n        'float',\n        'char',\n        'bool',\n        'u8',\n        'u16',\n        'u32',\n        'u64',\n        'f32',\n        'f64',\n        'i8',\n        'i16',\n        'i32',\n        'i64',\n        'str',\n        'Option',\n        'Either',\n        'c_float',\n        'c_double',\n        'c_void',\n        'FILE',\n        'fpos_t',\n        'DIR',\n        'dirent',\n        'c_char',\n        'c_schar',\n        'c_uchar',\n        'c_short',\n        'c_ushort',\n        'c_int',\n        'c_uint',\n        'c_long',\n        'c_ulong',\n        'size_t',\n        'ptrdiff_t',\n        'clock_t',\n        'time_t',\n        'c_longlong',\n        'c_ulonglong',\n        'intptr_t',\n        'uintptr_t',\n        'off_t',\n        'dev_t',\n        'ino_t',\n        'pid_t',\n        'mode_t',\n        'ssize_t'\n    ],\n    constants: ['true', 'false', 'Some', 'None', 'Left', 'Right', 'Ok', 'Err'],\n    supportConstants: [\n        'EXIT_FAILURE',\n        'EXIT_SUCCESS',\n        'RAND_MAX',\n        'EOF',\n        'SEEK_SET',\n        'SEEK_CUR',\n        'SEEK_END',\n        '_IOFBF',\n        '_IONBF',\n        '_IOLBF',\n        'BUFSIZ',\n        'FOPEN_MAX',\n        'FILENAME_MAX',\n        'L_tmpnam',\n        'TMP_MAX',\n        'O_RDONLY',\n        'O_WRONLY',\n        'O_RDWR',\n        'O_APPEND',\n        'O_CREAT',\n        'O_EXCL',\n        'O_TRUNC',\n        'S_IFIFO',\n        'S_IFCHR',\n        'S_IFBLK',\n        'S_IFDIR',\n        'S_IFREG',\n        'S_IFMT',\n        'S_IEXEC',\n        'S_IWRITE',\n        'S_IREAD',\n        'S_IRWXU',\n        'S_IXUSR',\n        'S_IWUSR',\n        'S_IRUSR',\n        'F_OK',\n        'R_OK',\n        'W_OK',\n        'X_OK',\n        'STDIN_FILENO',\n        'STDOUT_FILENO',\n        'STDERR_FILENO'\n    ],\n    supportMacros: [\n        'format!',\n        'print!',\n        'println!',\n        'panic!',\n        'format_args!',\n        'unreachable!',\n        'write!',\n        'writeln!'\n    ],\n    operators: [\n        '!',\n        '!=',\n        '%',\n        '%=',\n        '&',\n        '&=',\n        '&&',\n        '*',\n        '*=',\n        '+',\n        '+=',\n        '-',\n        '-=',\n        '->',\n        '.',\n        '..',\n        '...',\n        '/',\n        '/=',\n        ':',\n        ';',\n        '<<',\n        '<<=',\n        '<',\n        '<=',\n        '=',\n        '==',\n        '=>',\n        '>',\n        '>=',\n        '>>',\n        '>>=',\n        '@',\n        '^',\n        '^=',\n        '|',\n        '|=',\n        '||',\n        '_',\n        '?',\n        '#'\n    ],\n    escapes: /\\\\([nrt0\\\"''\\\\]|x\\h{2}|u\\{\\h{1,6}\\})/,\n    delimiters: /[,]/,\n    symbols: /[\\#\\!\\%\\&\\*\\+\\-\\.\\/\\:\\;\\<\\=\\>\\@\\^\\|_\\?]+/,\n    intSuffixes: /[iu](8|16|32|64|128|size)/,\n    floatSuffixes: /f(32|64)/,\n    tokenizer: {\n        root: [\n            [\n                /[a-zA-Z][a-zA-Z0-9_]*!?|_[a-zA-Z0-9_]+/,\n                {\n                    cases: {\n                        '@typeKeywords': 'keyword.type',\n                        '@keywords': 'keyword',\n                        '@supportConstants': 'keyword',\n                        '@supportMacros': 'keyword',\n                        '@constants': 'keyword',\n                        '@default': 'identifier'\n                    }\n                }\n            ],\n            // Designator\n            [/\\$/, 'identifier'],\n            // Lifetime annotations\n            [/'[a-zA-Z_][a-zA-Z0-9_]*(?=[^\\'])/, 'identifier'],\n            // Byte literal\n            [/'\\S'/, 'string.byteliteral'],\n            // Strings\n            [/\"/, { token: 'string.quote', bracket: '@open', next: '@string' }],\n            { include: '@numbers' },\n            // Whitespace + comments\n            { include: '@whitespace' },\n            [\n                /@delimiters/,\n                {\n                    cases: {\n                        '@keywords': 'keyword',\n                        '@default': 'delimiter'\n                    }\n                }\n            ],\n            [/[{}()\\[\\]<>]/, '@brackets'],\n            [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }]\n        ],\n        whitespace: [\n            [/[ \\t\\r\\n]+/, 'white'],\n            [/\\/\\*/, 'comment', '@comment'],\n            [/\\/\\/.*$/, 'comment']\n        ],\n        comment: [\n            [/[^\\/*]+/, 'comment'],\n            [/\\/\\*/, 'comment', '@push'],\n            ['\\\\*/', 'comment', '@pop'],\n            [/[\\/*]/, 'comment']\n        ],\n        string: [\n            [/[^\\\\\"]+/, 'string'],\n            [/@escapes/, 'string.escape'],\n            [/\\\\./, 'string.escape.invalid'],\n            [/\"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]\n        ],\n        numbers: [\n            //Octal\n            [/(0o[0-7_]+)(@intSuffixes)?/, { token: 'number' }],\n            //Binary\n            [/(0b[0-1_]+)(@intSuffixes)?/, { token: 'number' }],\n            //Exponent\n            [/[\\d][\\d_]*(\\.[\\d][\\d_]*)?[eE][+-][\\d_]+(@floatSuffixes)?/, { token: 'number' }],\n            //Float\n            [/\\b(\\d\\.?[\\d_]*)(@floatSuffixes)?\\b/, { token: 'number' }],\n            //Hexadecimal\n            [/(0x[\\da-fA-F]+)_?(@intSuffixes)?/, { token: 'number' }],\n            //Integer\n            [/[\\d][\\d_]*(@intSuffixes?)?/, { token: 'number' }]\n        ]\n    }\n};\n\n\n//# sourceURL=webpack:///./node_modules/monaco-editor/esm/vs/basic-languages/rust/rust.js?");

/***/ })

}]);