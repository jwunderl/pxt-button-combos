controller.combos.timeout = 1500;
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

// Test Timeout trigger, handling of multiple valid combos (take longest move)
// controller.combos.setTriggerType(TriggerType.Timeout)

// controller.combos.attachCombo("bab", function () {
//     game.splash("You pressed 'bab'");
// })

// controller.combos.attachCombo("abab", function () {
//     game.splash("You pressed 'abab'");
// })