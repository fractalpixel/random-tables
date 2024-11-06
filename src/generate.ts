import { Editor, EditorPosition } from "obsidian"
import { EMPTY_STRING_GENERATOR } from "./generator/EmptyStringGenerator"
import { KEYWORD_END_BRACKET, KEYWORD_END_BRACKET_ESCAPED, KEYWORD_START_BRACKET, 
         KEYWORD_START_BRACKET_ESCAPED, RANDOM_RESULT_KEYWORD, RANDOM_TABLE_KEYWORD } from "./settings"
import RandomGenerator from "./generator/RandomGenerator"



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
    const randomEntry = findNext(RANDOM_TABLE_KEYWORD, line, editor, RANDOM_RESULT_KEYWORD, searchForward)
    if (!randomEntry) {
        return // No random table found at this position
    }

    // Extract random generation parameters
    const parameterText = randomEntry.parameters
    console.log("Params " + parameterText)

    // Parse generator
    const wholeFile = false
    const generator = readRandomGenerator(line - 1, editor, wholeFile)

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

    const existingEndMarker = findNext(RANDOM_RESULT_KEYWORD, line + 1, editor, RANDOM_TABLE_KEYWORD, true);
    const postfix = existingEndMarker ? "\n" : "\n" + KEYWORD_START_BRACKET + RANDOM_RESULT_KEYWORD + KEYWORD_END_BRACKET + "\n"

    const seed = null
    const parameters: Map<string, string> = new Map()
    const generatedResult = generator.generate(seed, parameters) + postfix

    const pos: EditorPosition = {line:line + 1, ch:0};
    const endPos: EditorPosition = existingEndMarker ? {line:existingEndMarker.line, ch:0} : pos;

    editor.replaceRange(generatedResult, pos, endPos)
    editor.scrollIntoView({from: pos, to: endPos})

}



export function saveRandomResult(editor: Editor, line: number) {

    // Look at line, should contain end marker

    // Walk back until we find generator button

    // Look at parameters of generator, where should saving be done?

    // Copy text between generate button and save button, and paste it there.
    
    // Empty the area between the buttons

}


function findNext(bracketedKeyword: string, startLine: number, editor: Editor, stopBeforeKeyword: string | null = null, forward:boolean = true): {line:number, parameters: string} | null {
    
    const regExp = new RegExp(KEYWORD_START_BRACKET_ESCAPED + bracketedKeyword + "([^\r\n]*)" + KEYWORD_END_BRACKET_ESCAPED, "i");

    const stopBeforeExp = new RegExp(KEYWORD_START_BRACKET_ESCAPED + stopBeforeKeyword + "([^\r\n]*)" + KEYWORD_END_BRACKET_ESCAPED, "i");

    let line = startLine
    const delta = forward ? 1 : -1
    const lineCount = editor.lineCount()
    while(line >= 0 && line < lineCount) {
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



function readRandomGenerator(endLine: number, editor: Editor, wholeFile: boolean = false): RandomGenerator {

    if (endLine < 0) return EMPTY_STRING_GENERATOR

    function isListLine(s: string): boolean {
        const t = s.trimStart()
        return t.startsWith("- ") || t.startsWith("* ") || t.startsWith("+ ")
    }

    function isTableLine(s: string): boolean {
        const t = s.trimStart()
        return t.startsWith("|")
    }

    function isTextBlock(s: string): boolean {
        const t = s.trim()
        return t.length > 0 && 
            !t.startsWith("#")
    }

    function isRandomTableKeyword(s: string): boolean {
        const t = s.trimStart()
        return t.startsWith(KEYWORD_START_BRACKET + RANDOM_TABLE_KEYWORD) ||
            t.startsWith(KEYWORD_START_BRACKET + RANDOM_RESULT_KEYWORD)
    }

    type RandomTableDataType = "list" | "table" | "text"

    function lineType(line: number): RandomTableDataType | "empty" | null {
        const s = editor.getLine(line)
        if (isRandomTableKeyword(s)) return null
        else if (isListLine(s)) return "list"
        else if (isTableLine(s)) return "table"
        else if (isTextBlock(s)) return "text"
        else if (s.trim().length <= 0) return "empty"
        else return null
    }


    let tableData: string[] = []

    // If parameter 'whole file' is given, parse everything above as a random generator
    let startLine = 0

    if (!wholeFile) {
        // Look at previous non-empty line.
        // If it is a list, move up through all lines starting with list bullet, and parse them as a list table
        startLine = endLine

        // Jump over directly preceeding empty or header lines
        while (lineType(startLine) == "empty" && startLine > 0) {
            startLine--
            endLine--
        }

        let t = lineType(startLine)
        if (t == "empty" || t == null) {
            // If there was no random table data, return an empty generator
            return EMPTY_STRING_GENERATOR
        }
        else {
            // Gather all lines of the same type
            while (lineType(startLine) == t && startLine > 0) startLine--
            startLine++
        }
    }

    // Gather data
    for (let line = startLine; line <= endLine; line++) {
        tableData.push(editor.getLine(line))
    }

    console.log("Generator data:\n" + tableData.join("\n"))

    // (literal text until selection brackets, then entries are separated with ; 
    //  this allows generating larger chunks containing lists and such, but probably requires
    //  more robust table start, end and separator markers.  Perhaps %{  ;  }% or somesuch,
    //  but ideally just allow specifying them.  Looks like basic obsidian or dataview don't use {} )


    return EMPTY_STRING_GENERATOR
}