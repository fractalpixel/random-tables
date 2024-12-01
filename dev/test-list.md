# List of tests

## Planned for later

- Better testability for interacting with document, mock it and test parsing?
- Calculate cutoff point of gaussian weight function so that first value is specified number of times more probable than last value

- Support random tables in tables

## Implement next

- Support random tables in lists

- Invoke other tables (and pass in parameters?)

- Expressions as table weights
- Variable reference expression
- Addition expression
- Multiplication expression
- Dice expression
- Way to embed expressions in random generator

- Repetition generator
- Conditional / selection generator (using expression to pick branch? - similar to table?  Pick from table based on parameter (fixed value instead of random))

## Implemented

- Gaussian / exponential weighted table generator
- Handle zero or negative as parameter to linear weight distribution (directly pick last entry probably?)
- Parse linear weight distribution indicator and parameter
- Linearily up or down weighted table generator
- Custom weighted table generator
- Table generator
- Sequantial generator
- Constant generator
- Mock random
