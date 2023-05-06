extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:booster_gold_layer_1",
    "layer2": "shp:booster_gold_layer_2",
    //"overlay": "shp:booster_gold_overlay",
    "skeets": "shp:skeets"
});

var utils = implement("fiskheroes:external/utils");
var glow_right_hand;
function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "rightArm", 0xFFD700, [{
                "firstPerson": [-3.75, 3.0, -8.0],
                "offset": [-0.5, 12.0, 0.0],
                "size": [2.25, 2.25]
            }, {
                "firstPerson": [3.75, 3.0, -8.0],
                "offset": [0.5, 12.0, -1],
                "size": [2.25, 2.25],
                "anchor": "leftArm"
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "shp:impact_yellow_beam"));

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "head", 0xFFD700, [{
                "firstPerson": [-15, -6, -7.0],
                "offset": [-15, -6, 0.0],
                "size": [1.5, 1.5]
            }
        ]);
    var shield_color = "0xFFD700";

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(shield_color);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    var model = renderer.createResource("MODEL", "shp:skeets");
    /*
    model.bindAnimation("shp:skeets").setData((entity, data) => {
    data.load("1", entity.getInterpolatedData("shp:dyn/1float_reset"));
    data.load("2", entity.getInterpolatedData("shp:dyn/2float_reset"));
    data.load("3", entity.getInterpolatedData("shp:dyn/3float_reset"));
    data.load("4", entity.getData("shp:dyn/1boolean_reset"));
    data.load("5", entity.getData("shp:dyn/2boolean_reset"));
    data.load("6", entity.getData("shp:dyn/3boolean_reset"));
    });*/
    model.texture.set("skeets");

    skeets = renderer.createEffect("fiskheroes:model").setModel(model);
    skeets.anchor.set("head");

    /*
    this is if we use tentacle render of skeet
    var skeet_tentacle = utils.createModel(renderer, "shp:skeets", "skeets");
    skeet_tentacle.bindAnimation("shp:skeets").setData((entity, data) => data.load(1));
    var skeet_tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([{ "offset": [-2.0, -4.5, -2.0], "direction": [-13.0, 10.0, -10.0] }
    ]);
    skeet_tentacles.setHeadModel(skeet_tentacle);
    skeet_tentacles.anchor.set("head");
     */

    var glow = renderer.createResource("BEAM_RENDERER", "shp:glow");

    larm = utils.createLines(renderer, glow, shield_color, [{
                    "start": [0, -0.65, 0],
                    "end": [0.0, 0.65, 0.0],
                    "size": [3.8, 3.8]
                }
            ]);
    larm.anchor.set("leftArm");
    larm.setOffset(-1, 4.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    larm.mirror = false;

    rarm = utils.createLines(renderer, glow, shield_color, [{
                    "start": [0, -0.65, 0],
                    "end": [0.0, 0.65, 0.0],
                    "size": [3.8, 3.8]
                }
            ]);
    rarm.anchor.set("rightArm");
    rarm.setOffset(1, 4.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    rarm.mirror = false;

    lleg = utils.createLines(renderer, glow, shield_color, [{
                    "start": [0, -0.65, 0],
                    "end": [0.0, 0.7, 0.0],
                    "size": [3.8, 3.8]
                }
            ]);
    lleg.anchor.set("leftLeg");
    lleg.setOffset(0, 6.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    lleg.mirror = false;

    rleg = utils.createLines(renderer, glow, shield_color, [{
                    "start": [0, -0.65, 0],
                    "end": [0.0, 0.7, 0.0],
                    "size": [3.8, 3.8]
                }
            ]);
    rleg.anchor.set("rightLeg");
    rleg.setOffset(0, 6.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    rleg.mirror = false;

    body = utils.createLines(renderer, glow, shield_color, [{
                    "start": [0, -0.65, 0],
                    "end": [0.0, 0.65, 0.0],
                    "size": [3.8, 8.8]
                }
            ]);
    body.anchor.set("body");
    body.setOffset(0, 6.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    body.mirror = false;

    head = utils.createLines(renderer, glow, shield_color, [{
                    "start": [0, -0.48, 0],
                    "end": [0.0, 0.48, 0.0],
                    "size": [6.8, 6.8]
                }
            ]);
    head.anchor.set("head");
    head.setOffset(0, -4.0, 0.0).setRotation(0.0, 0.0, 0.0).setScale(10.0);
    head.mirror = false;

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimation(renderer, "basic.CHARGED_BEAM", "fiskheroes:dual_aiming").setData((entity, data) => data.load(Math.max(entity.getInterpolatedData("fiskheroes:beam_charge") * 5 - 4, 0)));

    addAnimationWithData(renderer, "basic.SHIELD", "shp:booster_block", "fiskheroes:shield_blocking_timer");

    addAnimation(renderer, "booster_gold.FLIGHT", "shp:flight/booster_gold.anim.json")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    }).setCondition(entity => entity.getData('shp:dyn/choose_flight') == 0)
    .priority = -10;

    addAnimation(renderer, "booster_gold.FLIGHT1", "fiskheroes:flight/default_arms_forward.anim.json")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    }).setCondition(entity => entity.getData('shp:dyn/choose_flight') == 1)
    .priority = -10;

    addAnimation(renderer, "booster_gold.FLIGHT2", "fiskheroes:flight/propelled_hands.anim.json")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    }).setCondition(entity => entity.getData('shp:dyn/choose_flight') == 2)
    .priority = -10;

    addAnimation(renderer, "booster_gold.FLIGHT3", "shp:flight/booster_gold_isaiki.anim.json")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    }).setCondition(entity => entity.getData('shp:dyn/choose_flight') == 3)
    .priority = -10;

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
    .priority = 10;

    addAnimationWithData(renderer, "recall.save", "shp:booster_time_travel", "shp:dyn/recall_timer");
    addAnimationWithData(renderer, "recall.load", "shp:booster_time_travel", "shp:dyn/recall_load_timer");

    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE_ROLL", "fiskheroes:falcon_dive_roll");
}

function render(entity, renderLayer) {
    //[x y z]
    var ammount = [18, 7.5, 18];
    var clamp_ammount = [18, 7.5, 18];
    var clamp = (value, min, max) => {
        return Math.min(Math.max(value, min), max)
    };

    var motionX = clamp(entity.motionInterpolated().x() * ammount[0],  -clamp_ammount[0], clamp_ammount[0]);
    var motionY = clamp(entity.motionInterpolated().y() *  ammount[1],  -clamp_ammount[1], clamp_ammount[1]);
    var motionZ = clamp(entity.motionInterpolated().z() *  ammount[2],  -clamp_ammount[2], clamp_ammount[2]);

    skeets.setOffset(15 + motionX, -25 + motionY, motionZ);
    skeets.render();

    if (entity.getData("fiskheroes:mask_open")) {
        if (renderLayer == "CHESTPLATE") {
            larm.render();
            rarm.render();
            body.render();
            lleg.render();
            rleg.render();
            head.render();
        }
    }

}
