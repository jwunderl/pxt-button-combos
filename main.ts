namespace button.combo {
    interface Combination {
        s: string;
        h: () => void;
    }
    let combinations: Combination[];
    let currState: boolean[];
    let maxCombo: number;
    let state: string;
    let manualEnter: boolean;
    let lastPressed: number;
    export let timeout: number;

    function init() {
        combinations = [];
        currState = [];
        state = "";
        maxCombo = 0;
        timeout = timeout | 0;
        manualEnter = false;
        currState[controller.up.id] = false;
        currState[controller.down.id] = false;
        currState[controller.left.id] = false;
        currState[controller.right.id] = false;
        currState[controller.A.id] = false;
        currState[controller.B.id] = false;
        lastPressed = game.runtime();

        game.onUpdate(function () {
            if (timeout > 0 && game.runtime() - lastPressed > timeout) {
                state = "";
            }

            checkButton(controller.up, "u");
            checkButton(controller.down, "d");
            checkButton(controller.left, "l");
            checkButton(controller.right, "r");
            checkButton(controller.A, "a");
            checkButton(controller.B, "b");

            state = state.substr(-maxCombo);
            if (!manualEnter) { // add || controller.menu.pressed() here
                combinations
                    .filter(c => c.s == state.substr(-c.s.length))
                    .forEach(c => {
                        state = "";
                        c.h();
                    });
            }
        })
    }

    function checkButton(b: controller.Button, s: string) {
        if (b.isPressed()) {
            if (!currState[b.id]) {
                currState[b.id] = true;
                state += s;
                lastPressed = game.runtime();
            }
        } else {
            currState[b.id] = false;
        }
    }

    export function attachCombo(combo: string, handler: () => void) {
        if (!combo || !handler) return;
        if (!combinations) init()

        // TODO check for invalid input, allow uppercase

        for (let c of combinations) {
            if (c.s == combo) {
                c.h = handler;
                return;
            }
        }

        maxCombo = Math.max(combo.length, maxCombo);
        combinations.push(
            {
                s: combo,
                h: handler
            }
        );
    }

    export function attachSpecialCode(handler: () => void) {
        attachCombo("uuddlrlrba", handler);
    }

    export function detachCombo(combo: string) {
        if (!combinations) return;
        for (let i = 0; i < combinations.length; i++) {
            if (combinations[i].s == combo) {
                combinations.removeAt(i);
                break;
            }
        }
    }
}