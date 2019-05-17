// Tests: Append `/` to the opening line of comment to start test, return to /** to end

// Test 1: General function
/**
controller.combos.setTimeout(1500);
controller.combos.attachSpecialCode(function () {
    game.splash("hi");
});

controller.combos.attachCombo("uullrr", function () {
    game.splash("you uuddlred");
})
controller.combos.attachCombo("uullrl", function () {
    controller.combos.detachCombo("uullrr");
    game.splash("disabled uullrr");
})
controller.combos.attachCombo("aaaaaaa", function () {
    game.splash("argh!");
})

controller.combos.attachCombo("a+b", function () {
    game.splash("multi button!")
})

// maybe should handle multiple combos with a more clear ruleset?
// controller.combos.attachCombo("a+l", () => game.splash("hi"))
controller.combos.attachCombo("a+l+d", function () {
    game.splash("super multi button!")
})
//*/

// Test menu trigger
/**
controller.combos.setTriggerType(TriggerType.Menu)
controller.combos.setTimeout(1500);
controller.combos.attachSpecialCode(function () {
    game.splash("hi");
});

controller.combos.attachCombo("uullrr", function () {
    game.splash("you uuddlred");
})
controller.combos.attachCombo("aaaaaaa", function () {
    game.splash("argh!");
})

controller.combos.attachCombo("a+b", function () {
    game.splash("multi button!")
})
//*/

// Test Timeout trigger, handling of multiple valid combos (take longest move)
/**
controller.combos.setTriggerType(TriggerType.Timeout)
controller.combos.setTimeout(500);

controller.combos.attachCombo("bab", function () {
    game.splash("You pressed 'bab'");
})

controller.combos.attachCombo("abab", function () {
    game.splash("You pressed 'abab'");
})
//*/

// test generate combo string
/**
while (true) {
    game.splash(controller.combos.generateComboString(5));
}
//*/

// full game test
/**/
type ButtonLetter = "u" | "d" | "l" | "r" | "a" | "b" | "+";
const f = image.doubledFont(image.font8);

info.setScore(0);
info.setLife(3)

controller.combos.setTriggerType(TriggerType.Continuous);
controller.combos.setTimeout(2000);


game.onUpdateInterval(1000, function () {
    const combo = generateUniqueCombo(Math.randomRange(2, 5));
    if (!combo) return;

    const comboDisplay = comboTag(combo);

    const comboSprite = sprites.create(comboDisplay, 1);
    comboSprite.vx = -10;
    comboSprite.x = screen.width;
    comboSprite.y = Math.randomRange(comboSprite.height >> 1, screen.height - (comboSprite.height >> 1));
    comboSprite.data = combo;

    controller.combos.attachCombo(combo, () => {
        comboSprite.vx = 0;
        comboSprite.destroy(effects.fire);
        info.changeScoreBy(1);
        music.baDing.playUntilDone()
    })
});

game.onUpdate(() => {
    sprites
        .allOfKind(1)
        .forEach(s => {
            if (s.x <= 0) {
                s.destroy();
                info.changeLifeBy(-1);
                music.wawawawaa.play();
            }
        });
});

sprites.onDestroyed(1, function (sprite: Sprite) {
    controller.combos.detachCombo(sprite.data as string);
});

function comboTag(combo: string) {
    const width = f.charWidth * combo.length;
    const height = f.charHeight;

    const comboDisplay = image.create(width + 4, height + 4);
    comboDisplay.fill(0xC);
    comboDisplay.fillRect(1, 1, width + 2, height + 2, 1);
    comboDisplay.printCenter(comboToDisplay(combo), 2, Math.randomRange(2, 0xF), f);

    return comboDisplay;
}

function generateUniqueCombo(difficulty: number) {
    let attempts = 10;
    do {
        const combo = generateCombo(difficulty);
        const alreadyExists = sprites
            .allOfKind(1)
            .some(s => s.data === combo);
        if (!alreadyExists) {
            return combo;
        }
    } while (attempts--);

    return undefined;
}

function generateCombo(difficulty: number) {
    const buttonLetters = ["u", "d", "l", "r", "a", "b"];
    let output = "";
    while (difficulty > 0) {
        --difficulty;
        let nextInput = Math.pickRandom(buttonLetters);

        if (Math.percentChance(15)) {
            --difficulty;
            let secondButton = Math.pickRandom(buttonLetters);
            while (nextInput == secondButton) {
                secondButton = Math.pickRandom(buttonLetters);
            }
            nextInput += "+" + secondButton;
        }

        output += nextInput;
    }

    return output;
}

function comboToDisplay(combo: string) {
    return combo
        .split("")
        .map(c => letterToDisplay(c as ButtonLetter))
        .join("");
}

function letterToDisplay(letter: ButtonLetter) {
    switch (letter) {
        case "u": return "↑";
        case "d": return "↓";
        case "l": return "←";
        case "r": return "→";
        default: return letter;
    }
}
//*/