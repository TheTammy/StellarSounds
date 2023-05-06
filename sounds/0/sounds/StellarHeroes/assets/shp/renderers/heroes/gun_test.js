extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:blank",
    "layer2": "shp:blank",
    "gun": "shp:test/texture"
});

var utils = implement("fiskheroes:external/utils");

var booster_boots;
var booster_back;

var suit_legs;
var suit_body;
var suit_head;
var suit_arms;

var model_guns;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => entity.isWearingFullSuit() && entity.getData("shp:dyn/lexmech_timer") == 1 ? renderLayer == "LEGGINGS" ? "invis_layer2" : "invis_layer1" : renderLayer == "LEGGINGS" ? "layer2" : "layer1");
    renderer.setLights((entity, renderLayer) => renderLayer == "CHESTPLATE" ? "lights" : null);
}

function initEffects(renderer) {

    var model = renderer.createResource("MODEL", "shp:gunRight");
    model.bindAnimation("shp:test").setData((entity, data) => data.load(1));
    model.texture.set("gun", "layer2");

    gun = renderer.createEffect("fiskheroes:model").setModel(model);
    gun.anchor.set("body");
}
function render(entity, renderLayer, isFirstPersonArm) {
    gun.render()
}