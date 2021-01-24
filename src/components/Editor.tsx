import React, { useEffect, useRef, useState } from 'react';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import * as monaco from 'monaco-editor';

/** Components */
import Settings from './Settings';

/** Lib */
import { makePrettier } from '../lib/makePrettier';
import { getCodeText, renderMarkdown } from '../lib/renderMarkdown';
import ErrorBoundary from './ErrorBoundary';
import PrintDialog from './PrintDialog';

export enum HtmlClassName {
  MonacoEditorContainerParentDiv = 'MonacoEditorContainerParentDiv',
  MonacoEditorContainer = 'MonacoEditorContainer',
  snComponent = 'sn-component',
  textarea = 'sk-input contrast textarea',
}

export enum HtmlElementId {
  fontSize = 'fontSize',
  language = 'language',
  minimap = 'minimap',
  tabSize = 'tabSize',
  theme = 'theme',
  wordWrap = 'wordWrap',
  saveAsDefault = 'saveAsDefault',

  buttonCancel = 'buttonCancel',
  buttonToggleEditMode = 'buttonToggleEditMode',
  buttonLoadSettings = 'buttonLoadSettings',
  buttonPrint = 'buttonPrint',
  buttonRefreshEditor = 'buttonRefreshEditor',
  buttonSaveSettings = 'buttonSaveSettings',
  buttonToggleViewMode = 'buttonToggleViewMode',

  contentContainer = 'contentContainer',
  MonacoEditorContainer = 'MonacoEditorContainer',
  settings = 'settingsContainer',
  settingsToggleButton = 'settingsToggleButton',
  snComponent = 'sn-component',
  viewContainer = 'viewContainer',
}

export interface SettingsInterface {
  fontSize: string;
  language: string;
  minimap: boolean;
  tabSize: number;
  theme: string;
  wordWrap: string;
}

export interface EditorInterface extends SettingsInterface {
  confirmPrintUrl: boolean;
  editMode: boolean;
  text: string;
  platform?: string;
  printUrl: boolean;
  refreshTokenEditor: boolean;
  refreshTokenView: boolean;
  showSettings: boolean;
  viewMode: boolean;
  /** this is used for handleSelectChange, but could mess with type checking */
  [x: string]: string | number | boolean | undefined;
}

const initialState = {
  confirmPrintUrl: false,
  editMode: false,
  fontSize: '16px',
  language: 'markdown',
  minimap: true,
  printUrl: true,
  refreshTokenEditor: false,
  refreshTokenView: false,
  showSettings: true,
  tabSize: 2,
  text: '',
  theme: 'sn-theme',
  viewMode: false,
  wordWrap: 'on',
};

const debugMode = false;
let keyMap = new Map();

let editor: monaco.editor.IStandaloneCodeEditor;
let diffEditor: monaco.editor.IStandaloneDiffEditor;
let lastBackgroundColor = 'white';
let lastDarkMode = true;
let lastPosition: monaco.IPosition;
let lastRefreshToken = false;
let wasEditorFocused = true;
let viewScrollTop = 0;

export default class Editor extends React.Component<{}, EditorInterface> {
  editorKit: any;
  saveTimer: NodeJS.Timeout | undefined;

  constructor(props: EditorInterface) {
    super(props);
    this.state = initialState;
  }

  configureEditorKit = () => {
    let delegate = new EditorKitDelegate({
      /** This loads every time a different note is loaded */
      setEditorRawText: (text: string) => {
        this.setState(
          {
            text,
          },
          () => {
            if (this.state.viewMode) {
              renderMarkdown.cancel();
              renderMarkdown(getCodeText(this.state.language, text));
              renderMarkdown.flush();
              this.refreshView();
            }
            /** Wait until the text has been loaded to show the editor */
            this.loadDefaultSettings(() => {});
            this.loadSettings();
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
    this.configureEditorKit();
    setTimeout(() => {
      this.setState({ editMode: true });
    }, 250);
  };

  saveSettings = () => {
    try {
      const note = this.editorKit.internal.note;
      let settings: SettingsInterface;
      settings = {
        fontSize: this.state.fontSize,
        language: this.state.language,
        minimap: this.state.minimap,
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
        this.setState({
          /** If each property is the appropriate type, then assign it.
           * Otherwise, set state as the current state. */
          fontSize:
            typeof loadedSettings.fontSize === 'string'
              ? loadedSettings.fontSize
              : this.state.fontSize,
          language:
            typeof loadedSettings.language === 'string'
              ? loadedSettings.language
              : this.state.language,
          minimap:
            typeof loadedSettings.minimap === 'boolean'
              ? loadedSettings.minimap
              : this.state.minimap,
          tabSize:
            typeof loadedSettings.tabSize === 'number'
              ? loadedSettings.tabSize
              : this.state.tabSize,
          theme:
            typeof loadedSettings.theme === 'string'
              ? loadedSettings.theme
              : this.state.theme,
          wordWrap:
            typeof loadedSettings.wordWrap === 'string'
              ? loadedSettings.wordWrap
              : this.state.wordWrap,
        });
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
      minimap: this.state.minimap,
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
            /** If each property is the appropriate type, then assign it.
             * Otherwise, set state as the current state. */
            fontSize:
              typeof defaultSettings.fontSize === 'string'
                ? defaultSettings.fontSize
                : this.state.fontSize,
            language:
              typeof defaultSettings.language === 'string'
                ? defaultSettings.language
                : this.state.language,
            minimap:
              typeof defaultSettings.minimap === 'boolean'
                ? defaultSettings.minimap
                : this.state.minimap,
            tabSize:
              typeof defaultSettings.tabSize === 'number'
                ? defaultSettings.tabSize
                : this.state.tabSize,
            theme:
              typeof defaultSettings.theme === 'string'
                ? defaultSettings.theme
                : this.state.theme,
            wordWrap:
              typeof defaultSettings.wordWrap === 'string'
                ? defaultSettings.wordWrap
                : this.state.wordWrap,
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
      console.error('Error loading editor options:', error);
    }
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value,
      },
      () => {
        /** Mini map is the only possible [name] */
        if (name === 'minimap') {
          this.saveSettings();
        }
      }
    );
  };

  handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value,
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
        this.saveSettings();
      }
    );
  };

  saveText = (text: string) => {
    this.saveNote(text);
    this.setState(
      {
        text: text,
      },
      () => {
        if (this.state.viewMode) {
          if (this.saveTimer) {
            clearTimeout(this.saveTimer);
          }
          this.refreshMarkdown();
        }
      }
    );
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
    this.setState({
      refreshTokenEditor: !this.state.refreshTokenEditor,
    });
  };

  refreshMarkdown = () => {
    this.saveTimer = setTimeout(() => {
      renderMarkdown.cancel();
      this.refreshView();
    }, 550);
  };

  refreshView = () => {
    this.setState({
      refreshTokenView: !this.state.refreshTokenView,
    });
  };

  toggleShowSettings = () => {
    this.setState(
      {
        showSettings: !this.state.showSettings,
      },
      () => {
        /** Refresh the editor to increase its height */
        if (!this.state.showSettings) {
          this.refreshEditor();
        }
        const toggleSettingsButton = document.getElementById(
          HtmlElementId.settingsToggleButton
        );
        if (toggleSettingsButton) {
          toggleSettingsButton.focus();
        }
      }
    );
  };

  toggleEditMode = () => {
    if (!this.state.editMode) {
      this.setState({
        editMode: true,
      });
    } else if (this.state.editMode) {
      this.setState(
        {
          editMode: false,
        },
        () => {
          this.toggleViewMode();
        }
      );
    }
  };

  toggleViewMode = () => {
    if (!this.state.viewMode) {
      this.setState(
        {
          viewMode: true,
        },
        () => {
          this.refreshEditor();
          const view = document.getElementById(HtmlElementId.viewContainer);
          if (view) {
            view.scrollTop = viewScrollTop;
          }
          this.refreshMarkdown();
        }
      );
    } else if (this.state.viewMode) {
      /** Record the scroll top of the view container */
      const view = document.getElementById(HtmlElementId.viewContainer);
      if (view) {
        viewScrollTop = view.scrollTop;
      }
      if (!this.state.editMode) {
        /** If the editor is closed, then open it */
        this.setState({
          editMode: true,
          viewMode: false,
        });
      } else if (this.state.editMode) {
        this.setState(
          {
            viewMode: false,
          },
          () => {
            /** If the editor is open, refresh the size */
            this.refreshEditor();
          }
        );
      }
    }
  };

  /** Printing */
  cancelPrint = () => {
    this.setState(
      {
        confirmPrintUrl: false,
      },
      () => {
        const printButton = document.getElementById(HtmlElementId.buttonPrint);
        if (printButton) {
          printButton.focus();
        }
      }
    );
  };

  confirmPrintUrl = () => {
    if (!this.state.viewMode) {
      this.toggleViewMode();
    }
    this.setState(
      {
        confirmPrintUrl: true,
      },
      () => {
        const cancelPrint = document.getElementById(HtmlElementId.buttonCancel);
        if (cancelPrint) {
          cancelPrint.focus();
        }
      }
    );
  };

  printUrlFalse = () => {
    this.setState(
      {
        confirmPrintUrl: false,
        printUrl: false,
      },
      () => {
        this.printRenderedHtml();
      }
    );
  };

  printUrlTrue = () => {
    this.setState(
      {
        confirmPrintUrl: false,
        printUrl: true,
      },
      () => {
        this.printRenderedHtml();
      }
    );
  };

  printRenderedHtml = () => {
    window.print();
    const printButton = document.getElementById(HtmlElementId.buttonPrint);
    if (printButton) {
      printButton.focus();
    }
  };

  /** Events */
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
        this.setState({
          wordWrap: 'off',
        });
      } else if (this.state.wordWrap === 'off') {
        this.setState({
          wordWrap: 'on',
        });
      }
    }
  };

  onKeyUp = (e: React.KeyboardEvent | KeyboardEvent) => {
    keyMap.delete(e.key);
  };

  render() {
    return (
      <div
        className={HtmlElementId.snComponent + ' ' + this.state.theme}
        id={HtmlElementId.snComponent}
        tabIndex={0}
      >
        <div
          id={HtmlElementId.contentContainer}
          className={
            (this.state.editMode ? 'editMode' : '') +
            ' ' +
            (this.state.viewMode ? 'viewMode' : '') +
            ' ' +
            (this.state.showSettings ? 'showSettings' : 'hideSettings') +
            ' ' +
            (this.state.printUrl ? 'print-url' : 'no-print-url')
          }
        >
          {this.state.editMode && (
            <div
              className={
                HtmlClassName.MonacoEditorContainerParentDiv +
                ' ' +
                this.state.theme
              }
            >
              <ErrorBoundary>
                <MonacoEditor
                  fontSize={this.state.fontSize}
                  language={this.state.language}
                  minimap={this.state.minimap}
                  onKeyDown={this.onKeyDown}
                  refreshTokenEditor={this.state.refreshTokenEditor}
                  saveText={this.saveText}
                  tabSize={this.state.tabSize}
                  text={this.state.text}
                  theme={this.state.theme}
                  wordWrap={this.state.wordWrap}
                />
              </ErrorBoundary>
            </div>
          )}
          {this.state.viewMode && (
            <ErrorBoundary>
              <View
                language={this.state.language}
                refreshTokenView={this.state.refreshTokenView}
                text={this.state.text}
              />
            </ErrorBoundary>
          )}
          {this.state.confirmPrintUrl && (
            <ErrorBoundary>
              <PrintDialog
                cancelText="No, thanks"
                confirmText="Yes, print URLs"
                helpLink={
                  'https://docs.standardnotes.org/usage/code-pro/#printing'
                }
                onUndo={this.cancelPrint}
                onCancel={this.printUrlFalse}
                onConfirm={this.printUrlTrue}
                title={`Would you like to print URLs?`}
              />
            </ErrorBoundary>
          )}
        </div>
        <ErrorBoundary>
          <Settings
            debugMode={debugMode}
            confirmPrintUrl={this.confirmPrintUrl}
            editMode={this.state.editMode}
            fontSize={this.state.fontSize}
            handleInputChange={this.handleInputChange}
            handleSelectChange={this.handleSelectChange}
            language={this.state.language}
            minimap={this.state.minimap}
            loadDefaultSettings={this.loadDefaultSettings}
            refreshEditor={this.refreshEditor}
            saveSettings={this.saveSettings}
            saveDefaultSettings={this.saveDefaultSettings}
            showSettings={this.state.showSettings}
            tabSize={this.state.tabSize}
            theme={this.state.theme}
            toggleEditMode={this.toggleEditMode}
            toggleShowSettings={this.toggleShowSettings}
            toggleViewMode={this.toggleViewMode}
            viewMode={this.state.viewMode}
            wordWrap={this.state.wordWrap}
          />
        </ErrorBoundary>
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
  minimap: boolean;
  onKeyDown: Function;
  onKeyUp?: Function;
  refreshTokenEditor: boolean;
  saveText: Function;
  tabSize: number;
  text: string;
  theme: string;
  wordWrap: string;
}

export const MonacoEditor: React.FC<MonacoEditorTypes> = ({
  fontSize = '16px',
  id = HtmlElementId.MonacoEditorContainer,
  language = 'javascript',
  minimap = true,
  onKeyDown,
  refreshTokenEditor,
  saveText,
  tabSize = 2,
  text,
  theme = 'vs-dark',
  wordWrap = 'on',
}) => {
  const divEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divEl.current) {
      const defineSnTheme = () => {
        const colorRegExp = /^#?([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?$/;
        const whiteSpaceRegExp = /\s+/g;

        let backgroundColor: string;
        let tempBackgroundColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--sn-stylekit-background-color')
          .replace(whiteSpaceRegExp, '');

        if (!tempBackgroundColor.match(colorRegExp)) {
          console.error('Error parsing background color', tempBackgroundColor);
          backgroundColor = '#ffffff';
        } else {
          backgroundColor = tempBackgroundColor;
        }

        let borderColor: string;
        let tempBorderColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--sn-stylekit-border-color')
          .replace(whiteSpaceRegExp, '');
        if (!tempBorderColor.match(colorRegExp)) {
          console.error('Error parsing border color', tempBorderColor);
          borderColor = '#e3e3e3';
        } else {
          borderColor = tempBorderColor;
        }

        let contrastBackgroundColor: string;
        let tempContrastBackgroundColor = getComputedStyle(
          document.documentElement
        )
          .getPropertyValue('--sn-stylekit-contrast-background-color')
          .replace(whiteSpaceRegExp, '');
        if (!tempContrastBackgroundColor.match(colorRegExp)) {
          console.error(
            'Error parsing contrast background color',
            tempContrastBackgroundColor
          );
          contrastBackgroundColor = '#F6F6F6';
        } else {
          contrastBackgroundColor = tempContrastBackgroundColor;
        }

        let dangerColor: string;
        let tempDangerColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--sn-stylekit-danger-color')
          .replace(whiteSpaceRegExp, '');
        if (!tempDangerColor.match(colorRegExp)) {
          console.error('Error parsing danger color', tempDangerColor);
          dangerColor = '#F80324'; // Red
        } else {
          dangerColor = tempDangerColor;
        }

        let foregroundColor: string;
        let fadedForegroundColor: string;
        let fadedTwiceForegroundColor: string;
        let tempForegroundColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--sn-stylekit-foreground-color')
          .replace(whiteSpaceRegExp, '');
        if (!tempForegroundColor.match(colorRegExp)) {
          console.error('Error parsing foreground color', tempForegroundColor);
          foregroundColor = '#000000';
          fadedForegroundColor = '#00000099'; /** 60 */
          fadedTwiceForegroundColor = '#0000001A'; /** 10 */
        } else {
          foregroundColor = tempForegroundColor;
          if (!foregroundColor.concat('99').match(colorRegExp)) {
            fadedForegroundColor = '#00000099'; /** 60 */
            fadedTwiceForegroundColor = '#0000001A'; /** 10 */
          } else {
            fadedForegroundColor = tempForegroundColor.concat('99'); /** 60% */
            fadedTwiceForegroundColor = tempForegroundColor.concat(
              '1A'
            ); /** 10% */
          }
        }

        let infoColor: string;
        let fadedInfoColor: string;
        let fadedTwiceInfoColor: string;
        let tempInfoColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--sn-stylekit-info-color')
          .replace(whiteSpaceRegExp, '');
        if (!tempInfoColor.match(colorRegExp)) {
          console.error('Error parsing info color', tempInfoColor);
          infoColor = '#086dd6';
          fadedInfoColor = '#086dd666'; /** 40% */
          fadedTwiceInfoColor = '#086dd633'; /** 20% */
        } else {
          infoColor = tempInfoColor;
          /** You only need to test for one */
          if (!tempInfoColor.concat('66').match(colorRegExp)) {
            fadedInfoColor = '#086dd666';
            fadedTwiceInfoColor = '#086dd633';
          } else {
            fadedInfoColor = tempInfoColor.concat('66'); // This is 40% opacity
            fadedTwiceInfoColor = tempInfoColor.concat('33'); // This is 20% opacity
          }
        }

        let shadowColor: string;
        let tempShadowColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--sn-stylekit-shadow-color')
          .replace(whiteSpaceRegExp, '');
        if (!tempShadowColor.match(colorRegExp)) {
          console.error('Error parsing shadow color', tempShadowColor);
          shadowColor = '#C8C8C8'; // Gray shadow
        } else {
          shadowColor = tempShadowColor;
        }

        let warningColor: string;
        let tempWarningColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--sn-stylekit-warning-color')
          .replace(whiteSpaceRegExp, '');
        if (!tempWarningColor.match(colorRegExp)) {
          console.error('Error parsing warning color', tempWarningColor);
          warningColor = '#f6a200'; // Orange
        } else {
          warningColor = tempWarningColor;
        }

        let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
          .matches;
        monaco.editor.defineTheme('sn-theme', {
          /** If sn-theme, then if not dark mode, use vs. Otherwise, use vs-dark (default) */
          base: !isDarkMode ? 'vs' : 'vs-dark',
          inherit: true,
          rules: [
            {
              token: '',
              background: backgroundColor,
              foreground: foregroundColor,
            },
          ],
          colors: {
            /** Ordered in mostly alphabetical order */
            //foreground: foregroundColor /* Overall foreground color. This color is only used if not overridden by a component.

            'button.background': backgroundColor, // Button background color.
            'button.foreground': foregroundColor, // Button foreground color.
            'button.hoverBackground': contrastBackgroundColor, // Button background color when hovering.

            /** This is what you see when you right click */
            'dropdown.background': contrastBackgroundColor, // Dropdown background.
            'dropdown.border': borderColor, // Dropdown border.
            'dropdown.foreground': foregroundColor, // Dropdown foreground.,

            'editor.background': backgroundColor, //
            'editor.foreground': foregroundColor, //
            'editor.inactiveSelectionBackground': fadedTwiceInfoColor, // Color of the selection in an inactive editor.
            'editor.lineHighlightBorder': fadedTwiceForegroundColor, // Background color for the border around the line at the cursor position.
            'editor.selectionBackground': fadedInfoColor, // Color of the editor selection.

            'editorCursor.foreground': fadedForegroundColor, //Color of the editor cursor.
            'editorError.foreground': dangerColor, // Foreground color of error squigglies in the editor.

            'editorLineNumber.foreground': fadedForegroundColor, // Color of editor line numbers.
            'editorLink.activeForeground': infoColor, // Color of active links. Such as when you press ctrl when hovering over a link

            'editorWidget.background': contrastBackgroundColor, // Background color of editor widgets, such as find/replace.
            'editorWidget.border': borderColor, // Border color of editor widgets. The color is only used if the widget chooses to have a border and if the color is not overridden by a widget.
            'editorWarning.foreground': warningColor, // Foreground color of warning squigglies in the editor.

            focusBorder: infoColor, // Overall border color for focused elements. This color is only used if not overridden by a component.

            'input.background': backgroundColor, //,// Input box background.
            'input.border': borderColor, // Input box border.
            'input.foreground': foregroundColor, // Input box foreground.

            'list.focusBackground': fadedInfoColor, // List/Tree background color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
            'list.focusForeground': foregroundColor, // List/Tree foreground color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
            'list.activeSelectionBackground': fadedInfoColor, // List/Tree background color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
            'list.activeSelectionForeground': foregroundColor, // List/Tree foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
            'list.inactiveSelectionBackground': backgroundColor, // List/Tree background color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
            'list.inactiveSelectionForeground': foregroundColor, // List/Tree foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
            'list.hoverBackground': backgroundColor, // List/Tree background when hovering over items using the mouse.
            'list.hoverForeground': foregroundColor, // List/Tree foreground when hovering over items using the mouse.
            'list.dropBackground': backgroundColor, // List/Tree drag and drop background when moving items around using the mouse.
            'list.highlightForeground': foregroundColor, // List/Tree foreground color of the match highlights when searching inside the list/tree.

            'textLink.activeForeground': infoColor, // Foreground color for active links in text. // Not sure where this is used.
            'textLink.foreground': infoColor, // Foreground color for links in text (such as "Follow Link")

            'widget.shadow': shadowColor, // Shadow color of widgets such as find/replace inside the editor.
          },
        });
        monaco.editor.setTheme(theme);
      };

      if (theme === 'sn-theme') {
        defineSnTheme();
      }

      editor = monaco.editor.create(divEl.current, {
        // These are variable: customizable by user or dependent on props
        fontFamily: 'var(--sn-stylekit-monospace-font)',
        fontSize: parseInt(fontSize.replace('px', '')),
        language: language,
        minimap: {
          enabled: minimap,
        },
        tabSize: tabSize,
        theme: theme,
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
          const formattedText = makePrettier(language, editor.getValue());
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

      editor.onDidFocusEditorWidget(() => {
        wasEditorFocused = true;

        /** If the theme has changed or dark mode has changed, redefine the sn-theme */
        let currentBackgroundColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--sn-stylekit-background-color');
        let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
          .matches;
        if (
          lastBackgroundColor !== currentBackgroundColor ||
          lastDarkMode !== isDarkMode
        ) {
          lastBackgroundColor = currentBackgroundColor;
          lastDarkMode = isDarkMode;
          defineSnTheme();
        }
      });

      editor.onDidBlurEditorWidget(() => {
        wasEditorFocused = false;
      });

      if (lastPosition) {
        editor.revealLineInCenterIfOutsideViewport(lastPosition.lineNumber);
        editor.setPosition(lastPosition);
      }
      /* If editor was previously focused, or is loaded the first time, focus again */
      if (wasEditorFocused || refreshTokenEditor !== lastRefreshToken) {
        lastRefreshToken = refreshTokenEditor;
        editor.focus();
      }
    }
    return () => {
      editor.dispose();
    };
    /** Do not include text so useEffect doesn't activate on each edit
     * A change in these things will cause a refresh of the editor.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fontSize,
    language,
    minimap,
    refreshTokenEditor,
    tabSize,
    theme,
    wordWrap,
  ]);
  return (
    <div
      id={id}
      className={HtmlClassName.MonacoEditorContainer + ' ' + theme}
      ref={divEl}
    ></div>
  );
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
    /** Do not include text so the editor doesn't refresh on each edit */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize, language, modifiedText, theme]);
  return (
    <div id={id} className={MonacoDiffEditorContainerID} ref={divEl}></div>
  );
};

interface ViewProps {
  language: string;
  refreshTokenView: boolean;
  text: string;
}

let lastLanguage: string;
export const View: React.FC<ViewProps> = ({
  language,
  refreshTokenView, // used to manually refresh the markdown
  text,
}) => {
  const [markdown, updateMarkdown] = useState(
    renderMarkdown(getCodeText(language, text))
  );
  useEffect(() => {
    if (lastLanguage !== language) {
      lastLanguage = language;
      renderMarkdown.cancel();
      renderMarkdown(getCodeText(language, text));
      renderMarkdown.flush();
    }
    updateMarkdown(renderMarkdown(getCodeText(language, text)));
  }, [language, text, refreshTokenView]);
  return <div id={HtmlElementId.viewContainer}>{markdown}</div>;
};
