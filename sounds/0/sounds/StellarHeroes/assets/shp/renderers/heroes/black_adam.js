extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:black_adam_layer_1",
    "layer2": "shp:black_adam_layer_2",
    "lights": "shp:black_adam_lights",
    "cape": "shp:black_adam_cape",
    "mask": "shp:black_adam_rock_mask"
});

var utils = implement("fiskheroes:external/utils");

var capes = implement("fiskheroes:external/capes");

var cape;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "CHESTPLATE" ? "lights" : null);

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.2;
    cape = capes.createDefault(renderer, 17, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    utils.bindTrail(renderer, "shp:black_adam");

    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0xFDD023, [{
                "firstPerson": [-8.0, 4.5, -10.0],
                "offset": [-0.5, 9.0, 0.0],
                "size": [0.75, 0.75]
            }
        ]);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "shp:lightning_beam", "rightArm", 0xFDD023, [{
                "firstPerson": [-4.5, 3.75, -8.0],
                "offset": [-0.5, 9.0, 0.0],
                "size": [3.0, 3.0]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "shp:impact_yellow_beam"));

    var model = renderer.createResource("MODEL", "fiskheroes:paper_mask");
    model.texture.set("mask");
    mask = renderer.createEffect("fiskheroes:model").setModel(model);
    mask.anchor.set("head");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");

    addAnimationWithData(renderer, "black_adam.LIGHTING_BEAM", "fiskheroes:aiming", "fiskheroes:energy_projection_timer");

    utils.addFlightAnimation(renderer, "black_adam.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "black_adam.HOVER", "fiskheroes:flight/idle/default");

}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }

    if (!isFirstPersonArm && renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:mask_open")) {
        mask.render();
    }
}
