
export default class TextSpan {
    constructor(
        public readonly startChar: number,
        public readonly endChar: number
    ) { }

    toString(): string {
        return this.startChar + " .. " + this.endChar
    }
}
