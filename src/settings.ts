import { App, PluginSettingTab, Setting } from "obsidian";
import RandomTablesPlugin from "./main";

export const KEYWORD_START_BRACKET = "{"
export const KEYWORD_END_BRACKET = "}"

export const KEYWORD_START_BRACKET_ESCAPED = escapeRegex(KEYWORD_START_BRACKET)
export const KEYWORD_END_BRACKET_ESCAPED = escapeRegex(KEYWORD_END_BRACKET)

/**
 * Keyword used to indicate the start of a random table.  Must be endclosed in brackets {}
 */
export const RANDOM_TABLE_START_KEYWORD = "RandomTableStart"

/**
 * Keyword used to indicate the end of a random table.  Must be endclosed in brackets {}
 */
export const RANDOM_TABLE_END_KEYWORD = "RandomTableEnd"

/**
 * Keyword used to indicate end of a generated result.  Must be endclosed in brackets {}
 */
export const RANDOM_RESULT_KEYWORD = "RandomResult"

/**
 * How close the cursor (or a selection) will have to be to the random generation button before we hide it.
 * 0 is right next to it, 1 is one character distant, etc.
 */
export const HIDE_BUTTON_MARGIN = 0;




/**
 * Settings for the Random Generator plugin.
 */
export interface RandomTablesPluginSettings {
	mySetting: string;
}


export const DEFAULT_SETTINGS: RandomTablesPluginSettings = {
	mySetting: 'default'
}


/**
 * UI for editing the settings for the Random Generator plugin.
 */
export class RandomGeneratorSettingTab extends PluginSettingTab {
	plugin: RandomTablesPlugin;

	constructor(app: App, plugin: RandomTablesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}




/** 
 * Escape some string so that it can be macthed literally by a regexp
 * From https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
 */
function escapeRegex(s: string) {
    return s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

