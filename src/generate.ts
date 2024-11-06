import { Editor, EditorPosition } from "obsidian"
import { RANDOM_RESULT_KEYWORD, RANDOM_TABLE_KEYWORD } from "./editor-buttons"

interface GeneratorName {
    name: string
    nameLine: number
    //document: 
}

// TODO: Remove?  Not used?
function findGeneratorNameAndLine(editor: Editor, documentName: string, pos: EditorPosition): GeneratorName {

    // Go back from the position to find the first heading (or document title).
    // This gives the name of the generator

    let line = pos.line

    // Regexp matching header line, with capturing group for header name
    const headerMatch = /^[^\S\r\n]*#+[ \t]+(\S.*)$/gm
    
    while(line >= 1) {
        // Get line
        const lineText = editor.getLine(line).trim()

        // Run regexp
        const headerMathResult = lineText.match(headerMatch)

        // Check if we got a match
        if (headerMathResult && headerMathResult.length > 0) {
            // Ensure the header was not empty
            const headerName = headerMathResult[1]?.trim() || ""
            if (headerName.length > 0) {

                // Return name
                return {name: headerName, nameLine: line}
            }
        }

        // Back one line
        line--
    }

    // Return document title if no header found
    return {name: documentName, nameLine: 0}
}


/**
 * Generates random entry based on random table at specified location.
 * 
 * @param editor Obsidian editor instance, for reading and manipulating file.
 * @param line the line to look for the random generator on.  Line numbers are 1-based (?)
 * @param searchForward if true, will look for random generator on the specified line or a later line.
 *                      if false, will look for random generator on the specified line or an earlier line.
 */
export default function generateRandomResult(editor: Editor, line: number, searchForward: boolean = false) {

    // Go back (or forward if specified) from line until first random generator entry is encountered
    // (if none is, go forward (or back) instead until random generator is encountered, otherwise abort)
    // TODO

    // Extract random generation parameters
    // TODO

    // Go back from random generator entry until a list, table, or paragraph is found.
    // Parse it as a random table (or random generator text).
    // TODO

    // Generate a result
    // TODO

    // Add the result directly after the random generator button by default, replacing a previous result
    // in that space (delimite the result how? -  perhaps some {/RandomResult} or similar?)
    // If there is no previous random result, add new delimiters for the result.
    // TODO
    
    // TODO: Render a save button for the result, which adds the result to a list below by default, but could
    //       add it elsewhere as well.
    // TODO: Change the random generator button to have a previous button as well?  Or use undo?

    const existingEndMarker = findNext(RANDOM_RESULT_KEYWORD, line, editor, RANDOM_TABLE_KEYWORD, true);
    const postfix = existingEndMarker ? "\n" : "\n{"+RANDOM_RESULT_KEYWORD + "}\n"

    const generatedResult = "Test result\nnumber: " + (count++) + postfix

    const pos: EditorPosition = {line:line, ch:0};
    const endPos: EditorPosition = existingEndMarker ? {line:existingEndMarker.line, ch:0} : pos;

    editor.replaceRange(generatedResult, pos, endPos)
    editor.scrollIntoView({from: pos, to: endPos})

}

// DEBUG
let count = 1



export function saveRandomResult(editor: Editor, line: number) {

    // Look at line, should contain end marker

    // Walk back until we find generator button

    // Look at parameters of generator, where should saving be done?

    // Copy text between generate button and save button, and paste it there.
    
    // Empty the area between the buttons

}


function findNext(bracketedKeyword: string, startLine: number, editor: Editor, stopBeforeKeyword: string | null = null, forward:boolean = true): {line:number, parameters: string} | null {
    
    const regExp = new RegExp("\{[^\S\r\n]*"+bracketedKeyword+"([^\r\n]*)\}", "gi");

    const stopBeforeExp = new RegExp("\{[^\S\r\n]*"+stopBeforeKeyword+"([^\r\n]*)\}", "gi");

    let line = startLine
    const delta = forward ? 1 : -1
    const lineCount = editor.lineCount()
    while(line > 0 && line <= lineCount) {
        // Get line
        const lineText = editor.getLine(line).trim()

        // Check if we ran into a keyword we should stop for        
        if (stopBeforeKeyword && lineText.match(stopBeforeExp)) {
            return null
        }

        // Run regexp
        const matchResult = lineText.match(regExp)

        // Check if we got a match
        if (matchResult && matchResult.length > 0) {
            // Get parameters
            const parameters = matchResult[1]?.trim() || ""
            return {line, parameters}
        }

        // Next line
        line += delta
    }

    return null
}