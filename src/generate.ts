import { Editor, EditorPosition } from "obsidian"

/**
 * Generates random entry based on random table at specified location.
 */
export default function generateRandomResult(editor: Editor, pos: EditorPosition) {

    //editor.getLine(pos.line)

    // Go back from the position to find the first heading (or document title).
    // This gives the name of the generator

    // TODO

    // Go forward from the heading to find the first {RandomTable} entry

    // TODO

    // Go back from the {RandomTable} entry to find the first paragraph, list, or table

    // TODO

    // Parse the random generator table

    // TODO

    // Generate a result

    // TODO

    // Add the result directly after the random generator button by default, replacing a previous result
    // in that space (delimite the result how? -  perhaps some {/RandomResult} or similar?)
    // If there is no previous random result, add new delimiters for the result.
    
    // TODO: Render a save button for the result, which adds the result to a list below by default, but could
    //       add it elsewhere as well.
    // TODO: Change the random generator button to have a previous button as well?  Or use undo?

    editor.replaceRange("Test insert", pos)

}