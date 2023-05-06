extend("fiskheroes:spider_man_base");
loadTextures({
    "base": "shp:spider_man_unlimited",
    "suit": "shp:spider_man_unlimited_suit.tx.json",
    "watch": "shp:spidey_unlimited_watch",
    "cape": "shp:spidey_unlimited_cape",
    "mask": "shp:spider_man_unlimited_mask.tx.json",
    "web_shield": "shp:web_shield",
    "spider": "shp:spider_model_texture"
});

var capes = implement("fiskheroes:external/capes");
var utils = implement("fiskheroes:external/utils");

var cape;
var metal_heat;
var shield;
var vibration;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.isDisplayStand() && !entity.isBookPlayer()) {
            if (entity.getInterpolatedData('fiskheroes:dyn/nanite_timer') == 0) {
                return "watch";
            }
            if (entity.getInterpolatedData('fiskheroes:dyn/nanite_timer') < 1) {
                return "suit";
            }
        }
        return "mask";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.5;
    cape = capes.createDefault(renderer, 17, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    utils.setOpacityWithData(renderer, 0, 1.0, "shp:dyn/invisible_float");

    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(cape.effect);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:energy_projection", "rightArm", 0xFF0000, [{
                "firstPerson": [-3.75, 3.0, -8.0],
                "offset": [-0.5, 12.0, 0.0],
                "size": [1.5, 1.5]
            }, {
                "firstPerson": [3.75, 3.0, -8.0],
                "offset": [-0.5, 12.0, 0.0],
                "size": [1.5, 1.5],
                "anchor": "leftArm"
            }
        ]);

    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set("web_shield", null);
    shield.anchor.set("rightArm");
    shield.setRotation(55.0, -20.0, -10.0).setCurve(15.0, 50.0);
    shield.large = true;
    

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "shp:invis", "body", 0x000000, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]);

    vibration = renderer.createEffect("fiskheroes:vibration");

    var spider = utils.createModel(renderer, "shp:spider", "spider", null);

    var tracer = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [0,0,0], "direction": [0,0,0] },
    ]).setCondition(entity => entity.getData('fiskheroes:grab_id') > -1);
    tracer.anchor.set("body");
    tracer.setHeadModel(spider);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "shp:swing_unlimited");
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", ["shp:swing_dive_unlimited", "shp:swing_dive_unlimited_1", "shp:swing_dive_unlimited_2", "shp:swing_dive_unlimited_3"]);

    addAnimationWithData(renderer, "spiderman.AIMING_DUAL", "fiskheroes:dual_aiming_fpcorr", "fiskheroes:aiming_timer")
    .priority = 2;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.effect.length = entity.isDisplayStand() || entity.isBookPlayer() ? 17 : (entity.getInterpolatedData('shp:dyn/invisible_timer') > 0 ? 1 + (0 - 1) * entity.getInterpolatedData('shp:dyn/invisible_timer') : entity.getInterpolatedData('shp:dyn/cape_float')) * 17;
        cape.render(entity);
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();

    shield.unfold = entity.getInterpolatedData("fiskheroes:shield_timer");
    shield.setOffset(3.75 + 2.25 * shield.unfold, 8.75 + 1.5 * shield.unfold, -0.75 * shield.unfold).setScale(1.5);
    shield.render();

    if (!entity.isDisplayStand() && entity.getData("fiskheroes:beam_shooting")) {
        vibration.render();
    }
}
