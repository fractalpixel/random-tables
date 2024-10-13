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

/**
 * Keyword used to indicate a random table.  Must be endclosed in brackets {}
 */
export const RANDOM_TABLE_KEYWORD = "RandomTable"

/**
 * How close the cursor (or a selection) will have to be to the random generation button before we hide it.
 * 0 is right next to it, 1 is one character distant, etc.
 */
const HIDE_BUTTON_MARGIN = 0;


/**
 * Widget for random generation button in the editor
 */ 
class RandomTableWidget extends WidgetType {
	constructor(private parameters: string) {
		super();
	}

	toDOM(view: EditorView): HTMLElement {
		const button = document.createElement("span");

		button.innerText = "Generate " + this.parameters;
		button.addClass("RandomGenerationButton")

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
	
		let decorations:[start:number,end:number,decoration:Decoration][]=[]

		for (let visibleRange of view.visibleRanges) {
			let viewContent: string = view.state.sliceDoc(visibleRange.from, visibleRange.to)

            // Find all random tables in the currently visible view area
			let tableRegExp = new RegExp("\{"+RANDOM_TABLE_KEYWORD+".*\}", "gi");

            // Render them as tables, if the cursor doesn't overlap them
			let result
			while (result = tableRegExp.exec(viewContent)) {
				let start = result.index
				let end = tableRegExp.lastIndex
				const parameters = view.state.doc.slice(start + 1 + RANDOM_TABLE_KEYWORD.length, end - 1).toString()

				// Don't render as a button if we are editing it						
				if (!view.state.selection.ranges.some((range)=> {
					return start-HIDE_BUTTON_MARGIN <= range.to && end+HIDE_BUTTON_MARGIN >= range.from
				})) {
					// Add widget
					decorations.push([start,
						end,
						Decoration.replace({
							widget: new RandomTableWidget(parameters),
						})
					]);
				}
			}
		}
	
		// Code mirror flips out if the decorations are not supplied to it pre-sorted.
		// Seems this is a common cause of bugs for apps using code mirror.
		// Would be nice if the builder took care of the sorting in the finish step...
		decorations.sort((a, b) => a[0] - b[0])

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

