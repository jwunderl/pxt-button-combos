enum TriggerType {
    Continuous,
    // Menu,
    // Event, // w/ `() => boolean` handler added below
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
    export let timeout: number;
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
            // .sort((one, two) => one.c.length - two.c.length) // for handling multiple events triggering, take longest matching sequence
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

    export function attachCombo(combo: string, handler: () => void) {
        if (!combo || !handler) return;
        if (!combinations) init()

        let c: number[] = toArray(combo);

        for (let move of combinations) {
            if (checkMove(move.c, c, true)) { // use checker function here
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

    export function attachSpecialCode(handler: () => void) {
        attachCombo("UUDDLRLRBA", handler);
    }

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

    export function setTriggerType(t: TriggerType) {
        triggerOn = t;
    }
}