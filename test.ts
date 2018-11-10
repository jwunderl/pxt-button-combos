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

controller.combos.attachCombo("aba", function () {
    game.splash("You pressed 'aba'");
})