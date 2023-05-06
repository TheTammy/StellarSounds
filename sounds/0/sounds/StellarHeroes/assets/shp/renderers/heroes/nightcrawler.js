extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:nightcrawler_layer1",
    "layer2": "shp:nightcrawler_layer2",
    "blank": "shp:blank"
});

var utils = implement("fiskheroes:external/utils");


function dashing(entity) {
    return (entity.getData("shp:dyn/1float_reset") > 0 && entity.getData("shp:dyn/1float_reset") < 1 && entity.isSprinting()) &&
    (entity.getData("shp:dyn/3boolean_reset") && !entity.isOnGround() && entity.motionY() > 0 || entity.isOnGround() || entity.getData("fiskheroes:flying")) && 
    entity.getData("fiskheroes:teleport_timer") == 0;
}
function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return dashing(entity) && entity.getHeldItem().isEmpty() ? "blank" : renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {
    utils.bindCloud(renderer, "fiskheroes:teleportation", "shp:brimstone");
    
    utils.bindParticles(renderer, "shp:nightcrawler_dash").setCondition(entity => dashing(entity));
    var sprint = renderer.bindProperty("fiskheroes:trail");
    sprint.setTrail(renderer.createResource("TRAIL", "shp:nightcrawler"));
    sprint.setCondition(entity => entity.isSprinting() && entity.getData("shp:dyn/1float_reset") == 1 && entity.loop(10) < 0.5);

    var sprint2 = renderer.bindProperty("fiskheroes:trail");
    sprint2.setTrail(renderer.createResource("TRAIL", "shp:nightcrawler_3"));
    sprint2.setCondition(entity => entity.isSprinting() && entity.getData("shp:dyn/1float_reset") == 1 && entity.loop(10) >= 0.5);

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return dashing(entity) && entity.getHeldItem().isEmpty() ? 0.9 : 1;
    });
}


function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.PROP_FLIGHT");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "shp.DOUBLE_JUMP", "fiskheroes:swing_roll5")
    .setData((entity, data) => data.load(entity.isOnGround() || entity.getData("shp:dyn/2float_interp_reset") == 0 ? 0 : entity.getInterpolatedData("shp:dyn/2float_interp_reset")));
    utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");
}

function render(entity, renderLayer, isFirstPersonArm) {

    if (!isFirstPersonArm) {
        if (renderLayer == "CHESTPLATE") {
            if ((!dashing(entity) || dashing(entity) && !entity.getHeldItem().isEmpty())) {
            }
        }
    }
}