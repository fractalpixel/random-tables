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
import { HIDE_BUTTON_MARGIN, KEYWORD_END_BRACKET, KEYWORD_END_BRACKET_ESCAPED, KEYWORD_START_BRACKET, KEYWORD_START_BRACKET_ESCAPED, RANDOM_RESULT_KEYWORD, RANDOM_TABLE_KEYWORD } from "./settings";

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

		/* It's distracting
		// Add tooltip to buttons
		// TODO: Exact tooltip content
		const tooltip = this.buttonType == "RandomGenerationButton" ?
			"Generate next random result from the table above":
			"Save this random result below";
		button.setAttribute("aria-label", tooltip)
		*/

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
		let buttonRegExp = new RegExp(KEYWORD_START_BRACKET_ESCAPED + buttonKeyword + "[^\r\n]*" + KEYWORD_END_BRACKET_ESCAPED, "gi");

		// Render them as buttons, if the cursor doesn't overlap them
		let result
		while (result = buttonRegExp.exec(viewContent)) {

			// Get parameters from within the brackers, after the keyword
			let start = visibleRange.from + result.index
			let end = visibleRange.from + buttonRegExp.lastIndex
			const parameters = view.state.sliceDoc(start + KEYWORD_START_BRACKET.length + buttonKeyword.length, end - KEYWORD_END_BRACKET.length).toString().trim()

			// Don't render as a button if we are editing it						
			if (!view.state.selection.ranges.some((range)=> {
				return start - HIDE_BUTTON_MARGIN <= range.to && end + HIDE_BUTTON_MARGIN >= range.from
			})) {

				// Get line number of button (required when it is pressed, to tell the handling code where to look at)
				const lineAtButton = view.state.doc.lineAt(start).number - 1 // Different conventions for whether to start numbering from 0 or 1, we use 0-based

				// Sanity check line numbers, code mirror fails if they differ
				const startLine = view.state.doc.lineAt(start).number
				const endLine = view.state.doc.lineAt(end).number
				if (startLine == endLine) {
					// Add widget for button
					decorations.push([start,
						end,
						Decoration.replace({
							widget: new ButtonWidget(parameters, lineAtButton, buttonType, buttonLabel),
						})
					]);
				}
				else {
					// Print an error if this happens, for easier debugging
					console.error("random-tables plugin: Start and end line ("+startLine+" and "+endLine+") of a random generator related keyword differed, can't render the keyword as a button.  This is a bug, feel free to file an issue in the issue tracker, please include an example file.  Sorry and thanks!")
				}
			}
		}
	}


}