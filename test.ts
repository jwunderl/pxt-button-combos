button.combo.timeout = 1500;
button.combo.attachSpecialCode(function () {
    game.splash("hi");
});

button.combo.attachCombo("uullrr", function () {
    game.splash("you uuddlred");
})
button.combo.detachCombo("uullrr");
button.combo.attachCombo("aaaaaaa", function () {
    game.splash("argh!");
})

button.combo.attachCombo("a+b", function () {
    game.splash("multi button!")
})