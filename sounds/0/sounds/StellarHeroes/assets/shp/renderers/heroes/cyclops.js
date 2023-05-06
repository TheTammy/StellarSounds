extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:cyclops_layer_1",
    "layer2": "shp:cyclops_layer_2",
    "mask": "shp:cylcops_mask",
    "lights1": "shp:cyclops_lights",
    "lights2": "shp:cyclops_charged_lights",
    "blank": "shp:blank"
});

var utils = implement("fiskheroes:external/utils");
var _helmet = implement("fiskheroes:external/iron_man_helmet");
var helmet;


function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "LEGGINGS") {
            return "layer2";
        }
        return "layer1";
    });

    renderer.setLights((entity, renderLayer) => {
        if (entity.getData('fiskheroes:mask_open_timer2') > 0) {
            return "blank";
        }
        if (entity.getData('fiskheroes:beam_charging') > 0) {
            return "lights2";
        }
        return "lights1";
    });

}

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "head", 0x860111, [{
                "firstPerson": [0.0, 0.0, 2.0],
                "offset": [0.0, -3.3, -4.0],
                "size": [8.0, 1.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:cold_beam", "head", 0x860111, [{
                "firstPerson": [4, 0.0, 2.0],
                "offset": [2, -3.3, -4.0],
                "size": [2.0, 2.0]
            }, {
                "firstPerson": [-4, 0.0, 2.0],
                "offset": [-2, -3.3, -4.0],
                "size": [2.0, 2.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));

    helmet = _helmet.createFaceplate(renderer, "mask", null);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.HEAT_VISION");

    addAnimation(renderer, "cyclops.PEW", "shp:cyclops_aim").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    addAnimationWithData(renderer, "cyclops.MASK", "shp:cyclops_aim_both", "fiskheroes:heat_vision_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
                helmet.render(entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
        }
    }
}
