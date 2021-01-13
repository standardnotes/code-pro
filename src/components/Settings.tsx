import React from 'react';
import {
  ChevronIconDown,
  ChevronIconRight,
  RefreshIcon,
  SaveIcon,
  WindowIcon,
} from './Icons';

import { HtmlElementId, SettingsInterface } from './Editor';

interface SettingsProps extends SettingsInterface {
  debugMode: boolean;
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  loadDefaultSettings: (callback: () => void) => void;
  refreshEditor: () => void;
  saveSettings: () => void;
  saveDefaultSettings: () => void;
  showSettings: boolean;
  toggleShowSettings: () => void;
}

interface SettingsState {
  [x: string]: string | number | boolean;
}

export default class Settings extends React.Component<
  SettingsProps,
  SettingsState
> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = {};
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  onFocus = () => {
    const settings = document.getElementById(HtmlElementId.settings);
    if (settings) {
      settings.classList.add('focused');
    }
  };

  onBlur = () => {
    const settings = document.getElementById(HtmlElementId.settings);
    if (settings) {
      settings.classList.remove('focused');
    }
  };

  loadDefaultSettings = () => {
    this.props.loadDefaultSettings(this.props.saveSettings);
  };

  render() {
    return (
      <div
        id={HtmlElementId.settings}
        className={this.props.showSettings ? 'show ' : 'hide '}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <section className="settings">
          {!this.props.showSettings && (
            <button
              className={'sk-button button sk-secondary-contrast'}
              id={HtmlElementId.settingsToggleButton}
              onClick={this.props.toggleShowSettings}
            >
              <ChevronIconRight role={'button'} />
            </button>
          )}
          {this.props.showSettings && (
            <button
              className={'sk-button button sk-secondary-contrast'}
              id={HtmlElementId.settingsToggleButton}
              onClick={this.props.toggleShowSettings}
            >
              <ChevronIconDown role={'button'} />
            </button>
          )}
        </section>
        {this.props.showSettings && [
          <section className="settings language">
            <label htmlFor={HtmlElementId.language}>Language:&nbsp;</label>
            <div>
              <label>
                <select
                  id={HtmlElementId.language}
                  name={HtmlElementId.language}
                  value={this.props.language}
                  onChange={this.props.handleSelectChange}
                >
                  <option>abap</option>
                  <option>aes</option>
                  <option>apex</option>
                  <option>azcli</option>
                  <option>bat</option>
                  <option>c</option>
                  <option>cameligo</option>
                  <option>clojure</option>
                  <option>coffeescript</option>
                  <option>cpp</option>
                  <option>csharp</option>
                  <option>csp</option>
                  <option>css</option>
                  <option>dart</option>
                  <option>dockerfile</option>
                  <option>fsharp</option>
                  <option>go</option>
                  <option>graphql</option>
                  <option>handlebars</option>
                  <option>hcl</option>
                  <option>html</option>
                  <option>ini</option>
                  <option>java</option>
                  <option>javascript</option>
                  <option>json</option>
                  <option>julia</option>
                  <option>kotlin</option>
                  <option>less</option>
                  <option>lexon</option>
                  <option>lua</option>
                  <option>markdown</option>
                  <option>mips</option>
                  <option>msdax</option>
                  <option>mysql</option>
                  <option>objective-c</option>
                  <option>pascal</option>
                  <option>pascaligo</option>
                  <option>perl</option>
                  <option>pgsql</option>
                  <option>php</option>
                  <option>plaintext</option>
                  <option>postiats</option>
                  <option>powerquery</option>
                  <option>powershell</option>
                  <option>pug</option>
                  <option>python</option>
                  <option>r</option>
                  <option>razor</option>
                  <option>redis</option>
                  <option>redshift</option>
                  <option>restructuredtext</option>
                  <option>ruby</option>
                  <option>rust</option>
                  <option>sb</option>
                  <option>scala</option>
                  <option>scheme</option>
                  <option>scss</option>
                  <option>shell</option>
                  <option>sol</option>
                  <option>sql</option>
                  <option>st</option>
                  <option>swift</option>
                  <option>systemverilog</option>
                  <option>tcl</option>
                  <option>twig</option>
                  <option>typescript</option>
                  <option>vb</option>
                  <option>verilog</option>
                  <option>xml</option>
                  <option>yaml</option>
                </select>
              </label>
            </div>
          </section>,
          <section className="settings">
            <label htmlFor={HtmlElementId.fontSize}>Font size:&nbsp;</label>
            <div className="input-and-undo-button">
              <select
                id={HtmlElementId.fontSize}
                name={HtmlElementId.fontSize}
                value={this.props.fontSize}
                onChange={this.props.handleSelectChange}
              >
                <option>12px</option>
                <option>13px</option>
                <option>14px</option>
                <option>15px</option>
                <option>16px</option>
                <option>17px</option>
                <option>18px</option>
                <option>19px</option>
                <option>20px</option>
                <option>21px</option>
                <option>22px</option>
                <option>23px</option>
                <option>24px</option>
                <option>25px</option>
                <option>26px</option>
              </select>
            </div>
          </section>,
          <section className="settings">
            <label htmlFor={HtmlElementId.tabSize}>Tab size:&nbsp;</label>
            <div className="input-and-undo-button">
              <select
                id={HtmlElementId.tabSize}
                name={HtmlElementId.tabSize}
                value={this.props.tabSize}
                onChange={this.props.handleSelectChange}
              >
                <option>2</option>
                <option>4</option>
              </select>
            </div>
          </section>,
          <section className="settings">
            <label htmlFor={HtmlElementId.theme}>Theme:&nbsp;</label>
            <div className="input-and-undo-button">
              <select
                id={HtmlElementId.theme}
                name={HtmlElementId.theme}
                value={this.props.theme}
                onChange={this.props.handleSelectChange}
              >
                <option>vs</option>
                <option>vs-dark</option>
                <option>hc-black</option>
                <option>sn-theme</option>
              </select>
            </div>
          </section>,
          <section className="settings">
            <label htmlFor={HtmlElementId.wordWrap}>Word wrap:&nbsp;</label>
            <div className="input-and-undo-button">
              <select
                id={HtmlElementId.wordWrap}
                name={HtmlElementId.wordWrap}
                value={this.props.wordWrap}
                onChange={this.props.handleSelectChange}
              >
                <option>on</option>
                <option>off</option>
                <option>bounded</option>
              </select>
            </div>
          </section>,
        ]}
        <section className="settings buttons">
          {this.props.showSettings && [
            <button
              className={'sk-button button sk-secondary-contrast'}
              onClick={this.props.saveDefaultSettings}
              title="Save current settings as your default"
            >
              <SaveIcon role={'button'} />
            </button>,
            <button
              className={'sk-button button sk-secondary-contrast'}
              onClick={this.loadDefaultSettings}
              title="Load your default settings"
            >
              <RefreshIcon role={'button'} />
            </button>,
          ]}
          <button
            className={'sk-button button sk-secondary-contrast'}
            onClick={this.props.refreshEditor}
            title="Resize the editor"
          >
            <WindowIcon role={'button'} />
          </button>
        </section>
      </div>
    );
  }
}
