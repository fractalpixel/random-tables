# Features

## Planned for later

- The seed-random library doesn't expand the provided seed to initialize the random generators properly, resulting in looping/small range outputs.  Implement an own random generator using one of the algorithms (e.g. xorwow), and various utility functions for it.
- Should we use e.g. ":" to indicate that the following char is a distribution selector in table blocks?

### Interface
- Add back button to Generate button, which generates the previous result (save current random seed when generating a result)
- Add clear button to Save Result?  Perhaps not too often needed feature.  Could also be in generate button row.  Could clear away the save button as well.
- Add copy action to save button row?
- Add 'configure / settings' action to generate element, that allows configuring the settings (see below)
- One could perhaps add the random seed to the parameters of both the generate and save buttons, allowing those to be paired.  Could allow funky things like random generating random generators without things breaking.
- Tune button appearance and margins (margins could be larger)
    - Test in light mode.
    - Ideally adapt the colors to light or dark mode (hard to adapt to specific themes, perhaps if we could query the background color)

### Functionality
- Random generator settings
    - Probability curve (flat, normal distr, linear, exponential)
        - The average should be around one, so that it's easy to specify custom weights as needed for individual entries (if entries are formatted as table with weight column - empty weight uses default).
    - Direction of probability (most common items first or last)
    - Whether to use previously generated results, and at what probability
    - How to save results: in list, as own pages in specified folder (look for title property in generated data?), as list in a specified location (specify page and optionally header).
    - Whether to add new entries to the start or end of the list (default to start)
- Paragraph / text generation applied to the selected entry
    - Recognize some grouping syntax, perhaps braces?  Square brackets are used for wikilinks and such.  E.g.:
        - A {\grumpy; angry; happy; thoughtful} {goblin; orc; ogre} with a {big;huge;small;sharp;rusty;dull;obviously stolen;way too oiled;} {sword;{silver;iron;copper;wooden;} {fork;spoon;chopstick};spear;knife;mallet;pitchfork;scissors;wrapped package} 
        - A symbol right after starting bracket can specify probability distribution (\ linear dropping, ~ normal distributed dropping).  (flat is default).
        - Weights could be specified with expression and colon at start of list entry: {5:rat; 1:goblin; 0.1:dragon}.
        - For clarity, spaces around entries could be trimmed, allowing newlines and better organization.
        - Some kind of solution for common operations like selecting between a/an, pluralizing something, and capitalizing or de-capitalizing something would be useful.  In addition, there might be need to expand that?  At least to some degree.
            - Some kind of function call syntax, perhaps just parenthesis after id?  an()  capitalize({a;b;c}), etc?  Maybe require functions to start with equals sign = ?  Natural language doesn't have many situations with words directly adjacent to parenthesis though, so could keep those.  If they don't parse, leave them unchanged.
        - Invoking other random generators elsewhere should be possible.  Perhaps link followed by parenthesis (function call syntax), that way it's easy to add parameters to generators too.
            - An() [[Random Color]]() hat made from [[Random Tables#Animals]](type="predator" or "omnivore") fur.
        - Parameters could be used to filter which entries are considered in tables (straightforward when table has columns with some name).  Allow specify ranges, comparsions, and set membership checks?
        - Parameters could also be numerical values that are set, and that the table weight expressions use when evaluating themselves.
        - A generator could use a parameter directly as a value as well (string insertion)
        - Weight expressions might also match strings and such?


## Implement next

- Parse block generator.
- Implement generators


## Implemented