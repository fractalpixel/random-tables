/*
 * The editor and preview use different technologies for rendering,
 * and require separate implementations of the random generation button.
 * 
 * The editor uses Code Mirror 6 for markdown editing.
 * 
 * We register a View plugin with the code mirror editor, that renders
 * the random table declaration and parameters as a randomization button.
 * 
 * To be able to edit the parameters or the buttons easily, the button rendering
 * is not done if any selection (the cursor is a 0 length selection) is within
 * a margin (default 1) of the button code.
 * 
 * The button determines the table it applies to, and the name of it from the closest preceeding heading 
 * (or the document name).
 * 
 * When the button is clicked, it invokes random generation code, passing in its parameters and location.
 * The random generation code may update the document.
 */


import { DecorationSet, WidgetType, Decoration, ViewUpdate, PluginValue, EditorView, PluginSpec, ViewPlugin } from "@codemirror/view";
import { RangeSetBuilder } from '@codemirror/state';
import { RANDOM_TABLES_PLUGIN_CONTEXT } from "./main";

/**
 * Keyword used to indicate a random table.  Must be endclosed in brackets {}
 */
export const RANDOM_TABLE_KEYWORD = "RandomTable"

/**
 * Keyword used to indicate end of a generated result.  Must be endclosed in brackets {}
 */
export const RANDOM_RESULT_KEYWORD = "RandomResult"

/**
 * How close the cursor (or a selection) will have to be to the random generation button before we hide it.
 * 0 is right next to it, 1 is one character distant, etc.
 */
const HIDE_BUTTON_MARGIN = 0;

type ButtonType = "RandomGenerationButton" | "RandomGenerationSaveButton"

/**
 * Widget for random generation button in the editor
 */ 
class ButtonWidget extends WidgetType {
	constructor(
		private parameters: string, 
		private lineNumber: number, 
		private buttonType: ButtonType,
		private text: string,
	) {
		super();
	}

	toDOM(view: EditorView): HTMLElement {
//		<span aria-label="aunque" data-tooltip-position="top" ttp-color="green">Fastän</span>


		//const tooltip = document.createElement("span")

		const button = document.createElement("span")

		button.innerText = this.text + " " + this.parameters
		button.addClass(this.buttonType)
        button.onClickEvent((element) => {
			if (this.buttonType == "RandomGenerationButton") {
	            RANDOM_TABLES_PLUGIN_CONTEXT.randomTablesPlugin?.doGenerateAction(this.lineNumber)
			}
			else if (this.buttonType == "RandomGenerationSaveButton") {
	            RANDOM_TABLES_PLUGIN_CONTEXT.randomTablesPlugin?.doSaveAction(this.lineNumber)
			}
        })

		// Add tooltip to buttons
		// TODO: Exact tooltip content
		const tooltip = this.buttonType == "RandomGenerationButton" ?
			"Generate next random result from the table above":
			"Save this random result below";
		button.setAttribute("aria-label", tooltip)

		return button;
	}
}

  
/**
 * Code Mirror editor plugin class that shows random generation buttons in the markdown editor.
 */ 
class RandomTableEditorPlugin implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged || update.selectionSet) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() {}

	buildDecorations(view: EditorView): DecorationSet {

		let decorations:[start:number,end:number,decoration:Decoration][] = []

		buildButtonDecorations(decorations, view, RANDOM_TABLE_KEYWORD, "RandomGenerationButton", "Generate")
		buildButtonDecorations(decorations, view, RANDOM_RESULT_KEYWORD, "RandomGenerationSaveButton", "Save Result")

		// Code mirror flips out if the decorations are not supplied to it pre-sorted.
		// Seems this is a common cause of bugs for apps using code mirror.
		// Would be nice if the builder took care of the sorting in the finish step...
		decorations.sort((a, b) => a[0] - b[0])

		// Build decorations
		const builder = new RangeSetBuilder<Decoration>();
		decorations.forEach((d) => builder.add(d[0], d[1], d[2]))
		return builder.finish();		
	}
}
  

const pluginSpec: PluginSpec<RandomTableEditorPlugin> = {
	decorations: (value: RandomTableEditorPlugin) => value.decorations,
};
  
/**
 * Code Mirror editor plugin instance that shows random generation buttons in the markdown editor.
 */ 
export const randomButtonsForEditorPlugin = ViewPlugin.fromClass(
	RandomTableEditorPlugin,
	pluginSpec
);




function buildButtonDecorations(
	decorations:[start:number,end:number,decoration:Decoration][],
	view: EditorView, 
	buttonKeyword: string, 
	buttonType: ButtonType,
	buttonLabel: string) {


	// Loop visible ranges (in case there are several..)
	for (let visibleRange of view.visibleRanges) {

		// Get text visible in the current visible range
		let viewContent: string = view.state.sliceDoc(visibleRange.from, visibleRange.to)

		// Find all random buttons in the currently visible view area
		let buttonRegExp = new RegExp("\{[^\S\r\n]*"+buttonKeyword+"[^\r\n]*\}", "gi");

		// Render them as buttons, if the cursor doesn't overlap them
		let result
		while (result = buttonRegExp.exec(viewContent)) {

			// Get parameters from within the brackers, after the keyword
			let start = result.index
			let end = buttonRegExp.lastIndex
			const parameters = view.state.doc.slice(start + 1 + buttonKeyword.length, end - 1).toString()

			// Don't render as a button if we are editing it						
			if (!view.state.selection.ranges.some((range)=> {
				return start-HIDE_BUTTON_MARGIN <= range.to && end+HIDE_BUTTON_MARGIN >= range.from
			})) {

				// Get line number of button (required when it is pressed, to tell the handling code where to look at)
				const lineAtButton = view.state.doc.lineAt(start)
				const lineNumber = lineAtButton.number

				// Add widget for button
				decorations.push([start,
					end,
					Decoration.replace({
						widget: new ButtonWidget(parameters, lineNumber, buttonType, buttonLabel),
					})
				]);
			}
		}
	}


}