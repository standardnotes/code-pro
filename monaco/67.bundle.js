(self["webpackJsonp"] = self["webpackJsonp"] || []).push([[67],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/vb/vb.js":
/*!********************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/vb/vb.js ***!
  \********************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"conf\", function() { return conf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"language\", function() { return language; });\n/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\nvar conf = {\n    comments: {\n        lineComment: \"'\",\n        blockComment: ['/*', '*/']\n    },\n    brackets: [\n        ['{', '}'],\n        ['[', ']'],\n        ['(', ')'],\n        ['<', '>'],\n        ['addhandler', 'end addhandler'],\n        ['class', 'end class'],\n        ['enum', 'end enum'],\n        ['event', 'end event'],\n        ['function', 'end function'],\n        ['get', 'end get'],\n        ['if', 'end if'],\n        ['interface', 'end interface'],\n        ['module', 'end module'],\n        ['namespace', 'end namespace'],\n        ['operator', 'end operator'],\n        ['property', 'end property'],\n        ['raiseevent', 'end raiseevent'],\n        ['removehandler', 'end removehandler'],\n        ['select', 'end select'],\n        ['set', 'end set'],\n        ['structure', 'end structure'],\n        ['sub', 'end sub'],\n        ['synclock', 'end synclock'],\n        ['try', 'end try'],\n        ['while', 'end while'],\n        ['with', 'end with'],\n        ['using', 'end using'],\n        ['do', 'loop'],\n        ['for', 'next']\n    ],\n    autoClosingPairs: [\n        { open: '{', close: '}', notIn: ['string', 'comment'] },\n        { open: '[', close: ']', notIn: ['string', 'comment'] },\n        { open: '(', close: ')', notIn: ['string', 'comment'] },\n        { open: '\"', close: '\"', notIn: ['string', 'comment'] },\n        { open: '<', close: '>', notIn: ['string', 'comment'] }\n    ],\n    folding: {\n        markers: {\n            start: new RegExp('^\\\\s*#Region\\\\b'),\n            end: new RegExp('^\\\\s*#End Region\\\\b')\n        }\n    }\n};\nvar language = {\n    defaultToken: '',\n    tokenPostfix: '.vb',\n    ignoreCase: true,\n    brackets: [\n        { token: 'delimiter.bracket', open: '{', close: '}' },\n        { token: 'delimiter.array', open: '[', close: ']' },\n        { token: 'delimiter.parenthesis', open: '(', close: ')' },\n        { token: 'delimiter.angle', open: '<', close: '>' },\n        // Special bracket statement pairs\n        // according to https://msdn.microsoft.com/en-us/library/tsw2a11z.aspx\n        {\n            token: 'keyword.tag-addhandler',\n            open: 'addhandler',\n            close: 'end addhandler'\n        },\n        { token: 'keyword.tag-class', open: 'class', close: 'end class' },\n        { token: 'keyword.tag-enum', open: 'enum', close: 'end enum' },\n        { token: 'keyword.tag-event', open: 'event', close: 'end event' },\n        {\n            token: 'keyword.tag-function',\n            open: 'function',\n            close: 'end function'\n        },\n        { token: 'keyword.tag-get', open: 'get', close: 'end get' },\n        { token: 'keyword.tag-if', open: 'if', close: 'end if' },\n        {\n            token: 'keyword.tag-interface',\n            open: 'interface',\n            close: 'end interface'\n        },\n        { token: 'keyword.tag-module', open: 'module', close: 'end module' },\n        {\n            token: 'keyword.tag-namespace',\n            open: 'namespace',\n            close: 'end namespace'\n        },\n        {\n            token: 'keyword.tag-operator',\n            open: 'operator',\n            close: 'end operator'\n        },\n        {\n            token: 'keyword.tag-property',\n            open: 'property',\n            close: 'end property'\n        },\n        {\n            token: 'keyword.tag-raiseevent',\n            open: 'raiseevent',\n            close: 'end raiseevent'\n        },\n        {\n            token: 'keyword.tag-removehandler',\n            open: 'removehandler',\n            close: 'end removehandler'\n        },\n        { token: 'keyword.tag-select', open: 'select', close: 'end select' },\n        { token: 'keyword.tag-set', open: 'set', close: 'end set' },\n        {\n            token: 'keyword.tag-structure',\n            open: 'structure',\n            close: 'end structure'\n        },\n        { token: 'keyword.tag-sub', open: 'sub', close: 'end sub' },\n        {\n            token: 'keyword.tag-synclock',\n            open: 'synclock',\n            close: 'end synclock'\n        },\n        { token: 'keyword.tag-try', open: 'try', close: 'end try' },\n        { token: 'keyword.tag-while', open: 'while', close: 'end while' },\n        { token: 'keyword.tag-with', open: 'with', close: 'end with' },\n        // Other pairs\n        { token: 'keyword.tag-using', open: 'using', close: 'end using' },\n        { token: 'keyword.tag-do', open: 'do', close: 'loop' },\n        { token: 'keyword.tag-for', open: 'for', close: 'next' }\n    ],\n    keywords: [\n        'AddHandler',\n        'AddressOf',\n        'Alias',\n        'And',\n        'AndAlso',\n        'As',\n        'Async',\n        'Boolean',\n        'ByRef',\n        'Byte',\n        'ByVal',\n        'Call',\n        'Case',\n        'Catch',\n        'CBool',\n        'CByte',\n        'CChar',\n        'CDate',\n        'CDbl',\n        'CDec',\n        'Char',\n        'CInt',\n        'Class',\n        'CLng',\n        'CObj',\n        'Const',\n        'Continue',\n        'CSByte',\n        'CShort',\n        'CSng',\n        'CStr',\n        'CType',\n        'CUInt',\n        'CULng',\n        'CUShort',\n        'Date',\n        'Decimal',\n        'Declare',\n        'Default',\n        'Delegate',\n        'Dim',\n        'DirectCast',\n        'Do',\n        'Double',\n        'Each',\n        'Else',\n        'ElseIf',\n        'End',\n        'EndIf',\n        'Enum',\n        'Erase',\n        'Error',\n        'Event',\n        'Exit',\n        'False',\n        'Finally',\n        'For',\n        'Friend',\n        'Function',\n        'Get',\n        'GetType',\n        'GetXMLNamespace',\n        'Global',\n        'GoSub',\n        'GoTo',\n        'Handles',\n        'If',\n        'Implements',\n        'Imports',\n        'In',\n        'Inherits',\n        'Integer',\n        'Interface',\n        'Is',\n        'IsNot',\n        'Let',\n        'Lib',\n        'Like',\n        'Long',\n        'Loop',\n        'Me',\n        'Mod',\n        'Module',\n        'MustInherit',\n        'MustOverride',\n        'MyBase',\n        'MyClass',\n        'NameOf',\n        'Namespace',\n        'Narrowing',\n        'New',\n        'Next',\n        'Not',\n        'Nothing',\n        'NotInheritable',\n        'NotOverridable',\n        'Object',\n        'Of',\n        'On',\n        'Operator',\n        'Option',\n        'Optional',\n        'Or',\n        'OrElse',\n        'Out',\n        'Overloads',\n        'Overridable',\n        'Overrides',\n        'ParamArray',\n        'Partial',\n        'Private',\n        'Property',\n        'Protected',\n        'Public',\n        'RaiseEvent',\n        'ReadOnly',\n        'ReDim',\n        'RemoveHandler',\n        'Resume',\n        'Return',\n        'SByte',\n        'Select',\n        'Set',\n        'Shadows',\n        'Shared',\n        'Short',\n        'Single',\n        'Static',\n        'Step',\n        'Stop',\n        'String',\n        'Structure',\n        'Sub',\n        'SyncLock',\n        'Then',\n        'Throw',\n        'To',\n        'True',\n        'Try',\n        'TryCast',\n        'TypeOf',\n        'UInteger',\n        'ULong',\n        'UShort',\n        'Using',\n        'Variant',\n        'Wend',\n        'When',\n        'While',\n        'Widening',\n        'With',\n        'WithEvents',\n        'WriteOnly',\n        'Xor'\n    ],\n    tagwords: [\n        'If',\n        'Sub',\n        'Select',\n        'Try',\n        'Class',\n        'Enum',\n        'Function',\n        'Get',\n        'Interface',\n        'Module',\n        'Namespace',\n        'Operator',\n        'Set',\n        'Structure',\n        'Using',\n        'While',\n        'With',\n        'Do',\n        'Loop',\n        'For',\n        'Next',\n        'Property',\n        'Continue',\n        'AddHandler',\n        'RemoveHandler',\n        'Event',\n        'RaiseEvent',\n        'SyncLock'\n    ],\n    // we include these common regular expressions\n    symbols: /[=><!~?;\\.,:&|+\\-*\\/\\^%]+/,\n    integersuffix: /U?[DI%L&S@]?/,\n    floatsuffix: /[R#F!]?/,\n    // The main tokenizer for our languages\n    tokenizer: {\n        root: [\n            // whitespace\n            { include: '@whitespace' },\n            // special ending tag-words\n            [/next(?!\\w)/, { token: 'keyword.tag-for' }],\n            [/loop(?!\\w)/, { token: 'keyword.tag-do' }],\n            // usual ending tags\n            [\n                /end\\s+(?!for|do)(addhandler|class|enum|event|function|get|if|interface|module|namespace|operator|property|raiseevent|removehandler|select|set|structure|sub|synclock|try|while|with|using)/,\n                { token: 'keyword.tag-$1' }\n            ],\n            // identifiers, tagwords, and keywords\n            [\n                /[a-zA-Z_]\\w*/,\n                {\n                    cases: {\n                        '@tagwords': { token: 'keyword.tag-$0' },\n                        '@keywords': { token: 'keyword.$0' },\n                        '@default': 'identifier'\n                    }\n                }\n            ],\n            // Preprocessor directive\n            [/^\\s*#\\w+/, 'keyword'],\n            // numbers\n            [/\\d*\\d+e([\\-+]?\\d+)?(@floatsuffix)/, 'number.float'],\n            [/\\d*\\.\\d+(e[\\-+]?\\d+)?(@floatsuffix)/, 'number.float'],\n            [/&H[0-9a-f]+(@integersuffix)/, 'number.hex'],\n            [/&0[0-7]+(@integersuffix)/, 'number.octal'],\n            [/\\d+(@integersuffix)/, 'number'],\n            // date literal\n            [/#.*#/, 'number'],\n            // delimiters and operators\n            [/[{}()\\[\\]]/, '@brackets'],\n            [/@symbols/, 'delimiter'],\n            // strings\n            [/[\"\\u201c\\u201d]/, { token: 'string.quote', next: '@string' }]\n        ],\n        whitespace: [\n            [/[ \\t\\r\\n]+/, ''],\n            [/(\\'|REM(?!\\w)).*$/, 'comment']\n        ],\n        string: [\n            [/[^\"\\u201c\\u201d]+/, 'string'],\n            [/[\"\\u201c\\u201d]{2}/, 'string.escape'],\n            [/[\"\\u201c\\u201d]C?/, { token: 'string.quote', next: '@pop' }]\n        ]\n    }\n};\n\n\n//# sourceURL=webpack:///./node_modules/monaco-editor/esm/vs/basic-languages/vb/vb.js?");

/***/ })

}]);