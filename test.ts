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
controller.combos.detachCombo("uullrr");
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