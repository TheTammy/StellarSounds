extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:danny_phantom",
    "eyes": "shp:green_eyes",
    "tail": "shp:ghost_tail",
    "transform": "shp:danny_phantom_transform.tx.json",
    "transform_blue": "shp:danny_phantom_transform_blue.tx.json",
    "blank": "shp:blank"
});

var utils = implement("fiskheroes:external/utils");
var ecto_charge_left;
var ecto_charge_right;
var eyes;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return "transform";
    });

    renderer.setLights((entity, renderLayer) => {
        if (entity.getData('shp:dyn/danny_phantom_transform_timer') == 0 || true) {
            return "blank";
        }
        return "transform_blue";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");

    forcefield.color.set(0x00FF00);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return entity.getData("fiskheroes:invisibility_timer") == 0;
    });

    var magic = renderer.bindProperty("fiskheroes:spellcasting");
    magic.colorGeneric.set(0x000000);

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return entity.getData('fiskheroes:intangible') ? 0.99 : 1;
    });

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "shp:telekinesis_danny_phantom");

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:cold_beam", "rightArm", 0x00FF00, [{
                "firstPerson": [-4.5, 3.75, -7.0],
                "offset": [-0.5, 9.0, 0.0],
                "size": [1.5, 1.5]
            }
        ]);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0x00FFFF, [{
                "firstPerson": [-4.5, 3.75, -8.0],
                "offset": [-0.5, 9.0, 0.0],
                "size": [3, 3]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "shp:impact_cold_beam"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "rightArm", 0x00FF00, [{
                "firstPerson": [-3.75, 3.0, -8.0],
                "offset": [-0.5, 12.0, 0.0],
                "size": [2.25, 2.25]
            }
            /*, {
            "firstPerson": [3.75, 3.0, -8.0],
            "offset": [0.5, 12.0, -1],
            "size": [2.25, 2.25],
            "anchor": "leftArm"
            }*/
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "shp:impact_ecto_beam"));

    var ecto_hand = renderer.createResource("BEAM_RENDERER", "shp:ecto_hand");

    ecto_hand_punch = utils.createLines(renderer, ecto_hand, "0x00FF00", [{
                    "start": [0, -0.1, 0],
                    "end": [0, 0.1, 0],
                    "size": [3, 3]
                }
            ]);
    ecto_hand_punch.anchor.set("rightArm");
    ecto_hand_punch.setOffset(1.2, 9.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(16);
    ecto_hand_punch.mirror = false;

    var ecto_charge = renderer.createResource("BEAM_RENDERER", "shp:ecto_charge");

    ecto_charge_right = utils.createLines(renderer, ecto_charge, "0x00FF00", [{
                    "start": [0, -0.1, 0],
                    "end": [0, 0.1, 0],
                    "size": [3, 3]
                }
            ]);
    ecto_charge_right.anchor.set("rightArm");
    ecto_charge_right.setOffset(1.2, 9.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(16);
    ecto_charge_right.mirror = false;

    var model = renderer.createResource("MODEL", "shp:GhostTail");
    model.texture.set("tail");

    tail = renderer.createEffect("fiskheroes:model").setModel(model);
    tail.anchor.set("body");

    var circle_shape = renderer.createResource("SHAPE", "shp:circle");
    var circle_beam = renderer.createResource("BEAM_RENDERER", "shp:line");

    circle1 = renderer.createEffect("fiskheroes:lines").setShape(circle_shape).setRenderer(circle_beam);
    circle1.color.set(0x00FF7E);
    circle1.setOffset(0, 0, 0).setScale(12);
    circle1.anchor.set("body");

    circle2 = renderer.createEffect("fiskheroes:lines").setShape(circle_shape).setRenderer(circle_beam);
    circle2.color.set(0x00FF7E);
    circle2.setOffset(0, 0, 0).setScale(12);
    circle2.anchor.set("body");

    eyes = renderer.createEffect("fiskheroes:overlay");
    eyes.texture.set(null, "eyes");

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "dannyphantom.CHARGED_BEAM", "fiskheroes:aiming").setData((entity, data) =>
        data.load((entity.getData('fiskheroes:beam_charging') ? Math.min(entity.getInterpolatedData('fiskheroes:beam_charge') * 3, 1)
                 : Math.max(entity.getInterpolatedData('fiskheroes:beam_charge') * 5 - 4, 0))));

    addAnimation(renderer, "dannyphantom.FLIGHT", "fiskheroes:flight/propelled.anim.json")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    })
    .priority = -10;

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);

    addAnimation(renderer, "dannyphantom.NOLEGS", "shp:begone_legs")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flying") && entity.isSprinting() ? 1 : 0);
    })
    .priority = -10;

}

function render(entity) {
    eyes.opacity = Math.min(Math.max(entity.getData("fiskheroes:aiming_timer") * 2, 0), 1);
    eyes.render();
    if (entity.isPunching() && entity.getData("shp:dyn/danny_phantom_transform_timer") == 1 && entity.getData("fiskheroes:aiming_timer") == 0) {
        ecto_hand_punch.render();
    }
    if (entity.getData("fiskheroes:aiming_timer") == 1) {
        ecto_charge_right.render();
    }
    if (entity.getInterpolatedData("fiskheroes:flying") && entity.isSprinting()) {
        tail.render();
        tail.opacity = 1;
        if (entity.getData('fiskheroes:intangible')) {
            tail.opacity = 0.2;
        }
    }
    if (entity.getData("shp:dyn/danny_phantom_transformed_timer") != 0) {
        circle1.setOffset(0, entity.getInterpolatedData("shp:dyn/danny_phantom_transform_timer") * -17 + 10, 0);
        circle1.render();
        circle2.setOffset(0, entity.getInterpolatedData("shp:dyn/danny_phantom_transform_timer") * 17 + 10, 0);
        circle2.render();
        /*
        if (entity.getData("shp:dyn/danny_phantom_transform_timer") < 0.7) {
        circle2.setOffset(0, entity.getInterpolatedData("shp:dyn/danny_phantom_transform_timer") * 25 + 10, 0);
        circle2.render();
        }
         */
    }

}
