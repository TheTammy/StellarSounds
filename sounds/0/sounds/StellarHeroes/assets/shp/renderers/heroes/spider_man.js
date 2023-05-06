extend("shp:spider_man_base");
loadTextures({
    "layer1": "shp:spider_gwen_layer_1",
    "layer2": "shp:spider_gwen_layer_1",
    "web_wings": "fiskheroes:spider_man_wings"
});

var web_wings;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    web_wings = renderer.createEffect("fiskheroes:wingsuit");
    web_wings.texture.set("web_wings");
    web_wings.opacity = 0.99;

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x00DAFF);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        web_wings.unfold = entity.getInterpolatedData("fiskheroes:wing_animation_timer");
        web_wings.render();
    }
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "shp:swing_unlimited");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", ["shp:animation_trick_holder"]);
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", ["shp:animation_holder"]);

    addAnimationWithData(renderer, "spiderman.AIMING_DUAL", "fiskheroes:dual_aiming_fpcorr", "fiskheroes:aiming_timer")
    .priority = 2;
}
