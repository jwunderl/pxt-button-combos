enum TriggerType {
    //% block="on each press"
    Continuous,
    //% block="on menu press"
    Menu,
    //% block="on timeout"
    Timeout,
    // Event, // w/ `() => boolean` handler added below
    //% block="never"
    Disabled
}

//% groups='["other","Combos"]'
namespace controller.combos {
    export enum ID {
        //% block="↑"
        up = 1 << 0,
        //% block="↓"
        down = 1 << 1,
        //% block="←"
        left = 1 << 2,
        //% block="→"
        right = 1 << 3,
        //% block="A"
        A = 1 << 4,
        //% block="B"
        B = 1 << 5,
        //menu = 1 << 6,
        //% block="+"
        plus = -1
    }

    interface Combination {
        c: number[];
        h: () => void;
    }

    interface ComboState {
        combinations: Combination[];
        currState: boolean[];
        maxCombo: number;
        state: number[];
        lastPressed: number;
        triggerOn: TriggerType;
        timeout: number;
        countAsOne: number;
        extendedCombos: boolean;
    }

    function init() {
        const comboState = getComboState();
        if (comboState) return;

        setComboState({
            combinations: [],
            currState: [],
            state: [],
            maxCombo: 0,
            extendedCombos: false,
            timeout: 0,
            countAsOne: 60,
            triggerOn: TriggerType.Continuous,
            lastPressed: game.runtime()
        });

        game.onUpdate(function () {
            const s = getComboState();
            if (s.timeout > 0 && game.runtime() - s.lastPressed > s.timeout) {
                if (s.triggerOn === TriggerType.Timeout) {
                    inputMove();
                }
                s.state = [];
            }
            if (s.triggerOn === TriggerType.Menu && controller.menu.isPressed()) {
                inputMove();
            }
            let newButtonPressed = false;

            const pressed = checkButton(controller.up, ID.up)
                | checkButton(controller.down, ID.down)
                | checkButton(controller.left, ID.left)
                | checkButton(controller.right, ID.right)
                | checkButton(controller.A, ID.A)
                | checkButton(controller.B, ID.B)

            if (pressed) {
                if (game.runtime() - s.lastPressed <= s.countAsOne) {
                    if (!(s.state[s.state.length - 1] & pressed)) {
                        s.state[s.state.length - 1] |= pressed;
                        newButtonPressed = true;
                    }
                } else {
                    s.state.push(pressed);
                    s.lastPressed = game.runtime();
                    newButtonPressed = true;
                }
            }

            if (s.state.length > s.maxCombo) {
                s.state.shift();
            }

            if (s.triggerOn === TriggerType.Continuous && newButtonPressed) {
                inputMove()
            }
        })
    }

    function inputMove() {
        const s = getComboState();
        let validMoves: Combination[] = s.combinations
            .filter(move => checkMove(move.c, s.state))
            .sort((one, two) => two.c.length - one.c.length);

        if (s.extendedCombos) {
            validMoves
                .forEach(move => move.h())
        } else {
            const move = validMoves.get(0);
            if (move) {
                s.state = [];
                move.h();
            }
        }
    }

    function checkButton(b: controller.Button, id: number): number {
        const s = getComboState();
        if (b.isPressed()) {
            if (!s.currState[b.id]) {
                s.currState[b.id] = true;
                return id;
            }
        } else {
            s.currState[b.id] = false;
        }
        return 0;
    }

    function checkMove(move: number[], actual: number[], exact?: boolean): boolean {
        const offset = actual.length - move.length;
        if (offset < 0 || (exact && move.length != actual.length))
            return false;

        for (let i = 0; i < move.length; i++) {
            if (move[i] != actual[i + offset]) {
                return false;
            }
        }

        return true;
    }

    function toArray(combo: string): number[] {
        let output: number[] = [];
        let combine = false;

        for (let i = 0; i < combo.length; i++) {
            let curr = charToId(combo.charAt(i));
            if (curr === ID.plus) {
                combine = true;
            } else if (curr) {
                if (combine) {
                    output[output.length - 1] |= curr;
                    combine = false;
                } else {
                    output.push(curr);
                }
            }
        }

        return output;
    }

    function charToId(letter: string): ID {
        switch (letter) {
            case "u": case "U": case "↑":
                return ID.up;
            case "d": case "D": case "↓":
                return ID.down;
            case "l": case "L": case "←":
                return ID.left;
            case "r": case "R": case "→":
                return ID.right;
            case "a": case "A":
                return ID.A;
            case "b": case "B":
                return ID.B;
            case "+":
                return ID.plus;
            default:
                return 0;
        }
    }


    /**
     * A piece of a button sequence. Can be text ``join``ed with buttons
     * to create a full sequence for ``generateComboString``
     * 
     * @param id the button to generate a string for
     */
    //% group="Combos"
    //% weight=90
    //% blockId=buttonCombosIdToString block="%id"
    export function idToString(id: ID): string {
        let output = checkId(id, ID.up, "U", "");
        output = checkId(id, ID.down, "D", output);
        output = checkId(id, ID.left, "L", output);
        output = checkId(id, ID.right, "R", output);
        output = checkId(id, ID.A, "A", output);
        return checkId(id, ID.B, "B", output);

        function checkId(id: ID, toMatch: ID, char: string, output: string) {
            if (!(toMatch & id))
                return output;

            if (output.length == 0)
                return char;
            else
                return output + "+" + char;
        }
    }

    /**
     * Returns a combo string matching the next `length` inputs
     * 
     * This is primarily intended to help in pre game development; that is,
     * using it to generate strings for the combos you want to add into your game.
     * 
     * @param length length of combo to track
     */
    export function generateComboString(length: number): string {
        init();
        const s = getComboState();

        s.maxCombo = length;
        const originalTrigger = s.triggerOn;
        s.triggerOn = TriggerType.Disabled;
        while (s.state.length < s.maxCombo)
            pause(1);

        const output = s.state
            .map(n => idToString(n))
            .join("");

        s.state = [];
        s.maxCombo = 0;
        s.combinations
            .forEach(c => s.maxCombo = Math.max(s.maxCombo, c.c.length));
        s.triggerOn = originalTrigger;
        return output;
    }

    /**
     * Add a new combo to the game.
     * 
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
    //% group="Combos"
    //% weight=100
    //% blockId=buttonCombosAttach block="on button combination %combo"
    export function attachCombo(combo: string, handler: () => void) {
        init();
        const s = getComboState();

        if (!combo) return;
        let c: number[] = toArray(combo);

        for (let move of s.combinations) {
            if (checkMove(move.c, c, true)) {
                move.h = handler;
                return;
            }
        }

        s.maxCombo = Math.max(combo.length, s.maxCombo);
        s.combinations.push(
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
    //% group="Combos"
    //% weight=10
    //% blockId=buttonCombosSpecialAttach block="on special combination"
    export function attachSpecialCode(handler: () => void) {
        attachCombo("UUDDLRLRBA", handler);
    }

    /**
     * Remove a previously attached combo
     * 
     * @param combo combo to remove; see attachCombo for format
     */
    //% group="Combos"
    //% weight=80
    //% blockId=buttonCombosDetach block="remove combo %combo"
    export function detachCombo(combo: string) {
        init();
        const s = getComboState();
        let c: number[] = toArray(combo);

        for (let i = 0; i < s.combinations.length; i++) {
            if (checkMove(s.combinations[i].c, c, true)) {
                s.combinations.removeAt(i);
                break;
            }
        }
    }

    /**
     * Set the amount of time between button presses before a combo is ended
     * 
     * @param t maximum amount of time between button presses that should trigger combo
     */
    //% group="Combos"
    //% weight=70
    //% blockId=buttonCombosTimeout block="set combo timeout to %t"
    export function setTimeout(t: number): void {
        init();
        const s = getComboState();
        s.timeout = t;
    }

    /**
     * Set the condition for when moves will trigger (attempt to run)
     * 
     * By default, this is set to TriggerType.Continuous, which will attempt to run
     * a combo each time a button is pressed
     */
    //% group="Combos"
    //% weight=60
    //% blockId=buttonCombosTriggerType block="combo trigger %t"
    export function setTriggerType(t: TriggerType) {
        init();
        const s = getComboState();
        s.triggerOn = t;
    }

    /**
     * Set extended combo mode to be on or off
     * 
     * If extended combo mode is on, allow multiple sequences to trigger from the same input;
     * for example, with an input of "ab", it will trigger events for "a", "b", and "ab"
     */
    //% group="Combos"
    //% weight=50
    //% blockId=buttonCombosSetExtendedComboMode block="set extended combo mode %on=toggleOnOff"
    export function setExtendedComboMode(on: boolean) {
        init();
        const s = getComboState();
        s.extendedCombos = on;
    }

    export function setCountAsOnePressTimer(length: number) {
        init();
        const s = getComboState();
        s.countAsOne = length;
    }

    function getComboState() {
        return game.currentScene().data.buttonComboState as ComboState;
    }

    function setComboState(state: ComboState) {
        game.currentScene().data.buttonComboState = state;
    }
}