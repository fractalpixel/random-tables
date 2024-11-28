
import { MarkdownView, Plugin } from 'obsidian';

import { randomButtonsForEditorPlugin } from './editor-buttons';
import { DEFAULT_SETTINGS, RandomGeneratorSettingTab, RandomTablesPluginSettings } from './settings';
import generateRandomResult, { saveRandomResult } from "./generate"

import SeedRandomImpl from "./random/SeedRandomImpl"


// Hacky global context for communicating with code mirror plugin
export let RANDOM_TABLES_PLUGIN_CONTEXT = {
	randomTablesPlugin: null as (RandomTablesPlugin | null)
}



export default class RandomTablesPlugin extends Plugin {

	settings!: RandomTablesPluginSettings;

	override async onload() {
		//console.log("Random Tables loaded")

		// Passing around values to CodeMirror plugins and such seems to be complicated 
		// (couldn't figure out how), so we'll resort to a global context...
		RANDOM_TABLES_PLUGIN_CONTEXT.randomTablesPlugin = this

		await this.loadSettings();		

		//this.registerEditorExtension(generateButton);

		this.registerEditorExtension(randomButtonsForEditorPlugin)

		/*
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice("test");
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');
		*/
	
		/*
		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');
		*/

		/*
		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView | MarkdownFileInfo) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}			
		});
		*/
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'generate-table-result',
			name: 'Generate Table Result',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				const editor = markdownView?.editor
				
				if (markdownView && editor) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						// Perform operation

						const pos = editor.getCursor("from")

						//const documentName = markdownView.file?.name || "Unknown"

						// Do the generation
						generateRandomResult(editor, pos.line)
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
				return false
			}
		});

		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RandomGeneratorSettingTab(this.app, this));

		/*
		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});
		*/

		/*
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
		*/
	}

	override onunload() {
		//console.log("unloaded randtab")
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	public doGenerateAction(line: number) {
		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		const editor = markdownView?.editor
		if (editor != null) {
			generateRandomResult(editor, line)
		}

	}

	public doSaveAction(line: number) {
		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		const editor = markdownView?.editor
		if (editor != null) {
			saveRandomResult(editor, line)
		}

	}

	
}

/*
class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	override onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	override onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
*/