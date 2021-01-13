/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import * as monaco from 'monaco-editor';

/** Prettier */
import prettier from 'prettier';
import parserMarkdown from 'prettier/parser-markdown';

import parserBabel from 'prettier/parser-babel';
import parserCss from 'prettier/parser-postcss';
import parserGraphql from 'prettier/parser-graphql';
import parserHtml from 'prettier/parser-html';
import parserTypescript from 'prettier/parser-typescript';
import parserYaml from 'prettier/parser-yaml';

/** Components */
import Settings from './Settings';

export enum HtmlClassName {
  MonacoEditorContainerParentDiv = 'MonacoEditorContainerParentDiv',
  MonacoEditorContainer = 'MonacoEditorContainer',
  snComponent = 'sn-component',
  textarea = 'sk-input contrast textarea',
}

export enum HtmlElementId {
  fontSize = 'fontSize',
  language = 'language',
  tabSize = 'tabSize',
  theme = 'theme',
  wordWrap = 'wordWrap',
  saveAsDefault = 'saveAsDefault',

  MonacoEditorContainer = 'MonacoEditorContainer',
  settings = 'settings',
  settingsToggleButton = 'settingsToggleButton',
  snComponent = 'sn-component',
  textarea = 'textarea',
}

export interface SettingsInterface {
  fontSize: string;
  language: string;
  tabSize: number;
  theme: string;
  wordWrap: string;
}

export interface EditorInterface extends SettingsInterface {
  text: string;
  platform?: string;
  showEditor?: boolean;
  showSettings: boolean;
  /** this is used for handleSelectChange, but could mess with type checking */
  [x: string]: string | number | boolean | undefined;
}

const initialState = {
  fontSize: '16px',
  language: 'markdown',
  showSettings: true,
  tabSize: 2,
  text: '',
  theme: 'vs-dark',
  wordWrap: 'on',
};

const debugMode = false;
let keyMap = new Map();
let lastPosition: monaco.IPosition;

export default class Editor extends React.Component<{}, EditorInterface> {
  editorKit: any;

  constructor(props: EditorInterface) {
    super(props);
    this.configureEditorKit();
    this.state = initialState;
  }

  configureEditorKit = () => {
    let delegate = new EditorKitDelegate({
      /** This loads every time a different note is loaded */
      setEditorRawText: (text: string) => {
        this.setState(
          {
            ...initialState,
            text,
          },
          () => {
            this.loadDefaultSettings(this.refreshEditor);
            this.loadSettings();
            /** This refreshes the editor */
            this.refreshEditor();
          }
        );
      },
      clearUndoHistory: () => {},
      getElementsBySelector: () => [],
    });

    this.editorKit = new EditorKit({
      delegate: delegate,
      mode: 'plaintext',
      supportsFilesafe: false,
    });
  };

  componentDidMount = () => {
    setTimeout(() => {
      const note = this.editorKit.internal.note;
      /** This runs if there's no note */
      if (note === undefined) {
        this.setState({ showEditor: true });
      }
    }, 500);
  };

  saveSettings = () => {
    try {
      const note = this.editorKit.internal.note;
      let settings: SettingsInterface;
      settings = {
        fontSize: this.state.fontSize,
        language: this.state.language,
        tabSize: this.state.tabSize,
        theme: this.state.theme,
        wordWrap: this.state.wordWrap,
      };
      this.editorKit.internal.componentManager.saveItemWithPresave(note, () => {
        note.content.codeEditorSettings = JSON.stringify(settings);
      });
    } catch (error) {
      console.error('Error saving settings', error);
    }
  };

  loadSettings = () => {
    this.editorKit.internal.componentManager.streamContextItem((note: any) => {
      // Load editor settings
      if (note.content.codeEditorSettings !== undefined) {
        const loadedSettings = JSON.parse(
          note.content.codeEditorSettings
        ) as SettingsInterface;
        if (debugMode) {
          console.log('loadedSettings', loadedSettings);
        }
        this.setState(
          {
            fontSize: loadedSettings.fontSize,
            language: loadedSettings.language,
            tabSize: loadedSettings.tabSize,
            theme: loadedSettings.theme,
            wordWrap: loadedSettings.wordWrap,
          },
          () => {
            this.refreshEditor();
          }
        );
      }
    });
  };

  saveEditorOption = (optionKey: string, optionValue: string) => {
    try {
      this.editorKit.internal.componentManager.setComponentDataValueForKey(
        optionKey,
        optionValue
      );
    } catch (error) {
      console.error(
        'Error saving editor option. Your optionKey:',
        optionKey,
        '\n - Your optionValue: ',
        optionValue,
        '\n - The error: ',
        error
      );
    }
  };

  saveDefaultSettings = () => {
    let defaultSettings: SettingsInterface;
    defaultSettings = {
      fontSize: this.state.fontSize,
      language: this.state.language,
      tabSize: this.state.tabSize,
      theme: this.state.theme,
      wordWrap: this.state.wordWrap,
    };
    this.saveEditorOption('defaultSettings', JSON.stringify(defaultSettings));
  };

  loadDefaultSettings = (callback: () => void) => {
    try {
      const settingsString = this.editorKit.internal.componentManager.componentDataValueForKey(
        'defaultSettings'
      );
      if (settingsString !== undefined) {
        const defaultSettings = JSON.parse(settingsString) as SettingsInterface;
        if (debugMode) {
          console.log('defaultSettings', defaultSettings);
        }
        this.setState(
          {
            fontSize: defaultSettings.fontSize,
            language: defaultSettings.language,
            tabSize: defaultSettings.tabSize,
            theme: defaultSettings.theme,
            wordWrap: defaultSettings.wordWrap,
          },
          () => {
            if (callback) {
              callback();
            }
          }
        );
      }
      this.setState(
        {
          platform: this.editorKit.internal.componentManager.platform,
        },
        () => {
          if (debugMode) {
            console.log(this.state.platform);
          }
        }
      );
    } catch (error) {
      // Log outside debug mode
      console.log('Error loading editor options:', error);
    }
  };

  handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target;
    const value = target.value;
    this.saveText(value);
  };

  handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value,
        showEditor: false,
      },
      () => {
        if (debugMode) {
          console.log(
            'Saved select. Name: ' +
              event.target.name +
              ' Value: ' +
              event.target.value
          );
        }
        this.setState({
          showEditor: true,
        });
        this.saveSettings();
      }
    );
  };

  saveText = (text: string) => {
    this.saveNote(text);
    this.setState({
      text: text,
    });
  };

  saveNote = (text: string) => {
    /** This will work in an SN context, but breaks the standalone editor,
     * so we need to catch the error
     */
    try {
      this.editorKit.onEditorValueChanged(text);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  refreshEditor = () => {
    this.setState(
      {
        showEditor: false,
      },
      () => {
        this.setState({
          showEditor: true,
        });
      }
    );
  };

  toggleShowSettings = () => {
    this.setState(
      {
        showSettings: !this.state.showSettings,
      },
      () => {
        const toggleSettingsButton = document.getElementById(
          HtmlElementId.settingsToggleButton
        );
        if (toggleSettingsButton) {
          toggleSettingsButton.focus();
        }
      }
    );
  };

  onBlur = (e: React.FocusEvent) => {};

  onFocus = (e: React.FocusEvent) => {};

  // Keyboard Events
  onKeyDown = (e: monaco.IKeyboardEvent) => {
    // Do nothing if 'Control' and 's' are pressed
    if (e.ctrlKey && e.code === 'KeyS') {
      e.preventDefault();
    } else if (e.altKey && e.code === 'KeyZ') {
      /** Toggle word wrap with Alt + Z */
      if (this.state.wordWrap === 'on') {
        this.setState(
          {
            wordWrap: 'off',
          },
          () => {
            this.refreshEditor();
          }
        );
      } else if (this.state.wordWrap === 'off') {
        this.setState(
          {
            wordWrap: 'on',
          },
          () => {
            this.refreshEditor();
          }
        );
      }
    }
  };

  onKeyUp = (e: React.KeyboardEvent | KeyboardEvent) => {
    keyMap.delete(e.key);
  };

  render() {
    return (
      <div
        className={HtmlElementId.snComponent + ' '}
        id={HtmlElementId.snComponent}
        tabIndex={0}
      >
        {this.state.showEditor && (
          <div className={HtmlClassName.MonacoEditorContainerParentDiv}>
            <MonacoEditor
              fontSize={this.state.fontSize}
              language={this.state.language}
              onKeyDown={this.onKeyDown}
              saveText={this.saveText}
              tabSize={this.state.tabSize}
              text={this.state.text}
              theme={this.state.theme}
              wordWrap={this.state.wordWrap}
            />
          </div>
        )}
        <Settings
          debugMode={debugMode}
          fontSize={this.state.fontSize}
          handleSelectChange={this.handleSelectChange}
          language={this.state.language}
          loadDefaultSettings={this.loadDefaultSettings}
          refreshEditor={this.refreshEditor}
          saveSettings={this.saveSettings}
          saveDefaultSettings={this.saveDefaultSettings}
          showSettings={this.state.showSettings}
          tabSize={this.state.tabSize}
          theme={this.state.theme}
          toggleShowSettings={this.toggleShowSettings}
          wordWrap={this.state.wordWrap}
        />
      </div>
    );
  }
}

const MonacoDiffEditorContainerID = 'MonacoDiffEditorContainer';

/*eslint no-restricted-globals: ["error", "event", "monaco"]*/
// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: any, label: string) {
    if (label === 'json') {
      return './monaco/json.worker.bundle.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './monaco/css.worker.bundle.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './monaco/html.worker.bundle.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './monaco/ts.worker.bundle.js';
    }
    return './monaco/editor.worker.bundle.js';
  },
};

const onKeyDownDebug = (keyCode: string, debugMode = false) => {
  if (debugMode) {
    //console.log('IKeyboardEvent Up: ' + keyCode);
  }
};

const onKeyUpDebug = (keyCode: string, debugMode = false) => {
  if (debugMode) {
    //console.log('IKeyboardEvent Up: ' + keyCode);
  }
};

interface MonacoEditorTypes {
  fontSize: string;
  id?: string;
  language: string;
  onKeyDown: Function;
  onKeyUp?: Function;
  saveText: Function;
  tabSize: number;
  text: string;
  theme: string;
  wordWrap: string;
}

export const MonacoEditor: React.FC<MonacoEditorTypes> = ({
  fontSize = '16px',
  id = HtmlClassName.MonacoEditorContainer,
  language = 'javascript',
  onKeyDown,
  saveText,
  tabSize = 2,
  text,
  theme = 'vs-dark',
  wordWrap = 'on',
}) => {
  const divEl = useRef<HTMLDivElement>(null);
  let editor: monaco.editor.IStandaloneCodeEditor;
  useEffect(() => {
    if (divEl.current) {
      //let darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      editor = monaco.editor.create(divEl.current, {
        // These are variable: customizable by user or dependent on props
        fontSize: parseInt(fontSize.replace('px', '')),
        language: language,
        tabSize: tabSize,
        /** if sn-theme, then if not dark mode, use vs. otherwise use vs-dark (default) */
        theme: theme === 'sn-theme' ? 'vs-dark' : theme,
        //@ts-ignore
        wordWrap: wordWrap,

        value: [text].join('\n'),

        // These are not customizable
        autoClosingOvertype: 'auto',
        formatOnPaste: true,
        formatOnType: true,
        wrappingStrategy: 'advanced',
      });

      // Keyboard Events
      editor.onKeyDown((e: monaco.IKeyboardEvent) => {
        if (e.ctrlKey && e.code === 'KeyS') {
          e.preventDefault();
        } else if (e.shiftKey && e.altKey && e.code === 'KeyF') {
          /** Format code */
          e.preventDefault();
          const previousPosition = lastPosition;
          const formattedText = formatCode(language, editor.getValue());
          if (formattedText) {
            editor.setValue(formattedText);
          }
          lastPosition = previousPosition;
          if (lastPosition) {
            editor.revealLineInCenterIfOutsideViewport(lastPosition.lineNumber);
            editor.setPosition(lastPosition);
          }
        }
        onKeyDownDebug(e.code, debugMode);
        onKeyDown(e);
      });

      editor.onKeyUp((e: monaco.IKeyboardEvent) => {
        onKeyUpDebug(e.code, debugMode);
      });

      // Content Change Events
      editor.onDidChangeModelContent(
        (e: monaco.editor.IModelContentChangedEvent) => {
          if (saveText) {
            saveText(editor.getValue());
          }
        }
      );

      editor.onDidChangeCursorPosition(
        (e: monaco.editor.ICursorPositionChangedEvent) => {
          let pos = editor.getPosition();
          if (pos) {
            lastPosition = pos;
          }
        }
      );
      if (lastPosition) {
        editor.revealLineInCenterIfOutsideViewport(lastPosition.lineNumber);
        editor.setPosition(lastPosition);
      }
      editor.focus();
    }
    return () => {
      editor.dispose();
    };
  }, []);
  return (
    <div
      id={id}
      className={HtmlClassName.MonacoEditorContainer + ' ' + theme}
      ref={divEl}
    ></div>
  );
};

/** Format code */
export const formatCode = (language: string, text: string) => {
  try {
    if (language === 'css') {
      const formattedText = prettier.format(text, {
        parser: 'css',
        plugins: [parserCss],
      });
      return formattedText;
    } else if (language === 'graphql') {
      const formattedText = prettier.format(text, {
        parser: 'graphql',
        plugins: [parserGraphql],
      });
      return formattedText;
    } else if (language === 'markdown') {
      const formattedText = prettier.format(text, {
        parser: 'markdown',
        plugins: [parserMarkdown],
      });
      return formattedText;
    } else if (language === 'html') {
      const formattedText = prettier.format(text, {
        parser: 'html',
        plugins: [parserHtml],
      });
      return formattedText;
    } else if (language === 'javascript') {
      const formattedText = prettier.format(text, {
        parser: 'babel',
        plugins: [parserBabel],
      });
      return formattedText;
    } else if (language === 'less') {
      const formattedText = prettier.format(text, {
        parser: 'less',
        plugins: [parserCss],
      });
      return formattedText;
    } else if (language === 'typescript') {
      const formattedText = prettier.format(text, {
        parser: 'typescript',
        plugins: [parserTypescript],
      });
      return formattedText;
    } else if (language === 'scss') {
      const formattedText = prettier.format(text, {
        parser: 'scss',
        plugins: [parserCss],
      });
      return formattedText;
    } else if (language === 'yaml') {
      const formattedText = prettier.format(text, {
        parser: 'yaml',
        plugins: [parserYaml],
      });
      return formattedText;
    }
  } catch (error) {
    console.error('Error formatting code:', error);
  }
};

/** For the Diff Editor Feature */
interface MonacoDiffEditorTypes extends MonacoEditorTypes {
  modifiedText: string;
}

export const MonacoDiffEditor: React.FC<MonacoDiffEditorTypes> = ({
  fontSize = '16',
  id = MonacoDiffEditorContainerID,
  language = 'markdown',
  saveText,
  text,
  modifiedText,
  theme = 'vs-dark',
}) => {
  const divEl = useRef<HTMLDivElement>(null);
  let diffEditor: monaco.editor.IStandaloneDiffEditor;

  if (fontSize === '') {
    fontSize = '16px';
  }

  useEffect(() => {
    if (divEl.current) {
      const originalModel = monaco.editor.createModel(
        [text].join('\n'),
        language
      );
      const modifiedModel = monaco.editor.createModel(
        [modifiedText].join('\n'),
        language
      );

      diffEditor = monaco.editor.createDiffEditor(divEl.current, {
        // Same settings as above
        // These are variable: customizable by user or dependent on props
        fontSize: parseInt(fontSize.replace('px', '')),
        theme: theme,

        // These are not customizable
        autoClosingOvertype: 'auto',
        formatOnPaste: true,
        formatOnType: true,
        wordWrap: 'on',
        wrappingStrategy: 'advanced',

        // Specific to Diff Editor
        originalEditable: true, // for left panel
        readOnly: true, // for right panel
      });
      diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel,
      });

      // Content Change Events
      originalModel.onDidChangeContent(
        (e: monaco.editor.IModelContentChangedEvent) => {
          if (saveText) {
            saveText(originalModel.getValue());
          }
        }
      );
    }
    return () => {
      diffEditor.dispose();
    };
  }, []);
  return (
    <div id={id} className={MonacoDiffEditorContainerID} ref={divEl}></div>
  );
};
