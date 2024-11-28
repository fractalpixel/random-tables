import { expect } from "vitest";
import { ParseResult } from "./ParseResult";

// Utility functions used by tests

export function expectSuccess<T>(
    result: ParseResult<T>, 
    expectedValue: T, 
    expectedEndPos: number | undefined = undefined) 
{
    expect(result.isOk()).toBeTruthy()
    expect(result.value).toEqual(expectedValue)
    checkPos(result, expectedEndPos)
}

export function expectFailure<T>(
    result: ParseResult<T>,
    expectedEndPos: number | undefined = undefined) 
{
    expect(result.isOk()).toBeFalsy()
    expect(result.value).toEqual(undefined)
    checkPos(result, expectedEndPos)
}

function checkPos<T>(
    result: ParseResult<T>,    
    expectedEndPos: number | undefined = undefined) 
{
    if (expectedEndPos !== undefined)
        expect(result.endPos).toEqual(expectedEndPos)

}
