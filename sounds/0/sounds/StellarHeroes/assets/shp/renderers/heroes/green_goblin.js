extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:green_goblin_layer1",
    "layer2": "shp:green_goblin_layer2",
    "glider": "shp:goblin_glider"
});

var utils = implement("fiskheroes:external/utils");
var glider;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    var glider_model = renderer.createResource("MODEL", "shp:goblin_glider");
    glider_model.bindAnimation("shp:flight/idle/glider_idle").setData((entity, data) => {
        //i put this the same as the hover animation just in case you want it like this
        data.load(0, entity.getInterpolatedData("fiskheroes:levitate_timer"));
        data.load(1, entity.loop(20 * Math.PI) + 0.4);
        
    });
    glider_model.texture.set("glider");


    glider = renderer.createEffect("fiskheroes:model").setModel(glider_model);
    glider.anchor.set("body");
    glider.setOffset(0.0, 1.0, -6.0);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "goblin.FLIGHT", "shp:flight/green_goblin.anim.json");
    utils.addHoverAnimation(renderer, "goblin.HOVER", "shp:flight/idle/glider_idle");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm) {
        if (entity.getData('fiskheroes:flying')) {
            glider.render();
        }
    }
}