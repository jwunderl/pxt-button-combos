# pxt-button-combos

## Reference

### On Button Combination

Add a new combo to the game.

Combos are represented by a string of characters that correspond to button presses,
where u=up, d=down, l=left, r=right, a=A, and b=B. `+` can be used between characters to
require them to be pressed at the same time.

| controller button | value |
|---| ---|
| up | U |
| down | D |
| left | L |
| right | R |
| A | A |
| B | B |

The sequence "press a, followed by b, followed by down and right at the same time" would
be represented by the string "abd+r".

Each combo must be distinct; adding a new handler for a previously used combo
will overwrite the old handler.

@param combo the combo move sequence: see full combo for examples.
@param handler function to run when combo has been inputted.

### Button Ids

A piece of a button sequence. Can be text ``join``ed with buttons
to create a full sequence for ``generateComboString``

@param id the button to generate a string for

### Remove Combo

Remove a previously attached combo..

@param combo combo to remove; see attachCombo for format.

### Set Combo Timeout

Set the amount of time between button presses before a combo is ended.

@param t maximum amount of time between button presses that should trigger combo.

### Combo Trigger

Set the condition for when moves will trigger (attempt to run).

By default, this is set to TriggerType.Continuous, which will attempt to run
a combo each time a button is pressed.

### On Special Combination

Add a new event that runs when a special code is entered.

The special code for this event is:
>up, up, down, down, left, right, left, right, B, A

@param handler event to run when the code is entered.

## TODO

- [x] Add a reference for your blocks here
- [x] Add "icon.png" image (300x200) in the root folder
- [x] Add "- beta" to the GitHub project description if you are still iterating it.
- [x] Use "pxt bump" to create a tagged release on GitHub
- [x] Get your package reviewed and approved https://arcade.makecode.com/packages/approval

Read more at https://arcade.makecode.com/packages/build-your-own

## License

MIT

Copyright 2019 Joey Wunderlich

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Supported targets

* for PXT/arcade
(The metadata above is needed for package search.)
