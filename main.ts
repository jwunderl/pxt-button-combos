enum TriggerType {
    //% block="attempt to input on each press"
    Continuous,
    // Menu,
    // Event, // w/ `() => boolean` handler added below
    //% block="attempt to input on timeout"
    Timeout
}

namespace controller.combos {
    enum ID {
        up = 1 << 0,
        down = 1 << 1,
        left = 1 << 2,
        right = 1 << 3,
        A = 1 << 4,
        B = 1 << 5
    }

    interface Combination {
        c: number[];
        h: () => void;
    }

    let combinations: Combination[];
    let currState: boolean[];
    let maxCombo: number;
    let state: number[];
    let lastPressed: number;
    let triggerOn: TriggerType;
    //% block="combo timeout"
    export let timeout: number;
    //% block="minimum time between different moves"
    export let countAsOne: number;

    function init() {
        combinations = [];
        currState = [];
        state = [];
        maxCombo = 0;
        timeout = timeout | 0;
        if (countAsOne == undefined) countAsOne = 60;
        triggerOn = triggerOn | TriggerType.Continuous;
        lastPressed = game.runtime();

        game.onUpdate(function () {
            if (timeout > 0 && game.runtime() - lastPressed > timeout) {
                if (triggerOn === TriggerType.Timeout) {
                    inputMove();
                }
                state = [];
            }

            const pressed = checkButton(controller.up, ID.up)
                | checkButton(controller.down, ID.down)
                | checkButton(controller.left, ID.left)
                | checkButton(controller.right, ID.right)
                | checkButton(controller.A, ID.A)
                | checkButton(controller.B, ID.B);

            if (pressed) {
                if (game.runtime() - lastPressed <= countAsOne) {
                    state[state.length - 1] |= pressed;
                } else {
                    state.push(pressed);
                    lastPressed = game.runtime();
                }
            }

            if (state.length > maxCombo) {
                state.shift();
            }

            if (triggerOn === TriggerType.Continuous) {
                inputMove()
            }
        })
    }

    function inputMove() {
        let move = combinations
            .filter(move => checkMove(move.c, state))
            .sort((one, two) => two.c.length - one.c.length)
            .get(0);
        if (move) {
            state = [];
            control.runInParallel(move.h);
        }
    }

    function checkButton(b: controller.Button, id: number): number {
        if (b.isPressed()) {
            if (!currState[b.id]) {
                currState[b.id] = true;
                return id;
            }
        } else {
            currState[b.id] = false;
        }
        return 0;
    }

    function checkMove(move: number[], actual: number[], exact?: boolean): boolean {
        const offset = actual.length - move.length;
        if (offset < 0 || (exact && move.length != actual.length)) return false;

        for (let i = 0; i < move.length; i++) {
            if (move[i] != actual[i + offset]) return false;
        }
        return true;
    }

    function toArray(combo: string): number[] {
        let output: number[] = [];

        for (let i = 0; i < combo.length; i++) {
            let curr = charToId(combo.charAt(i));

            while (i + 2 < combo.length && combo.charAt(i + 1) == "+") {
                i += 2;
                curr |= charToId(combo.charAt(i));
            }

            if (curr) output.push(curr);
        }

        return output;
    }

    function charToId(letter: string): ID {
        switch (letter) {
            case "u":
            case "U": return ID.up;
            case "d":
            case "D": return ID.down;
            case "l":
            case "L": return ID.left;
            case "r":
            case "R": return ID.right;
            case "a":
            case "A": return ID.A;
            case "b":
            case "B": return ID.B;
            default: return 0;
        }
    }

    /**
     * Add a new combo to the game.
     * Combos are represented by a string of characters that correspond to button presses,
     * where u=up, d=down, l=left, r=right, a=A, and b=B. `+` can be used between characters to
     * require them to be pressed at the same time.
     * 
     * The sequence "press a, followed by b, followed by down and right at the same time" would
     * be represented the string "abd+r"
     * 
     * Each combo must be distinct; adding a new handler for a previously used combo
     * will overwrite the old handler
     * 
     * @param combo the combo move sequence: see full combo for examples
     * @param handler function to run when combo has been inputted
     */
    export function attachCombo(combo: string, handler: () => void) {
        if (!combo) return;
        if (!combinations) init()

        let c: number[] = toArray(combo);

        for (let move of combinations) {
            if (checkMove(move.c, c, true)) {
                move.h = handler;
                return;
            }
        }

        maxCombo = Math.max(combo.length, maxCombo);
        combinations.push(
            {
                c: c,
                h: handler
            }
        );
    }

    /**
     * Add a new event that runs when a special code is entered.
     * 
     * The special code for this event is:
     * up, up, down, down, left, right, left, right, B, A
     * 
     * @param handler event to run when the code is entered
     */
    export function attachSpecialCode(handler: () => void) {
        attachCombo("UUDDLRLRBA", handler);
    }

    /**
     * Remove a previously attached combo
     * 
     * @param combo combo to remove; see attachCombo for format
     */
    export function detachCombo(combo: string) {
        if (!combinations) return;
        let c: number[] = toArray(combo);

        for (let i = 0; i < combinations.length; i++) {
            if (checkMove(combinations[i].c, c, true)) {
                combinations.removeAt(i);
                break;
            }
        }
    }

    /**
     * Set the condition for when moves will trigger (attempt to run)
     * 
     * By default, this is set to TriggerType.Continuous, which will attempt to run
     * a combo each time a button is pressed
     */
    export function setTriggerType(t: TriggerType) {
        triggerOn = t;
    }
}