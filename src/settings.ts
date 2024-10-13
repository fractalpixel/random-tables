import { App, PluginSettingTab, Setting } from "obsidian";
import RandomTablesPlugin from "./main";

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
