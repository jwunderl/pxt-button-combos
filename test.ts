button.combo.timeout = 500;
button.combo.attachSpecialCode(function () {
    game.splash("hi");
});

let id = button.combo.attachCombo("uullrr", function () {
    game.splash("you uuddlred");
})
button.combo.detachCombo(id);