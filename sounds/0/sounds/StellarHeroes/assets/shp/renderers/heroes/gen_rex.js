extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:gen_rex/gen_rex_layer_1",
    "layer2": "shp:gen_rex/gen_rex_layer_2",
    "mask": "shp:gen_rex/gen_rex_mask",
    "build_wings_texture": "shp:gen_rex/build_wings_texture",
    "build_sword_texture": "shp:gen_rex/build_sword_texture",
    "build_boots_texture": "shp:gen_rex/build_boots_texture",
    "build_smack_hands_texture": "shp:gen_rex/build_smack_hands_texture",
    "curing": "shp:gen_rex/curing.tx.json"
});

var utils = implement("fiskheroes:external/utils");
var _helmet = implement("fiskheroes:external/iron_man_helmet");
var helmet;
var wings_render;
var model_left_render;
var model_right_render;
var sword;
var smack_right_hand;
var smack_left_hand;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        return "curing";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    //wings
    var wings = renderer.createResource("MODEL", "shp:gen_rex/build_wings");
    wings.texture.set("build_wings_texture");
    wings_render = renderer.createEffect("fiskheroes:model").setModel(wings);
    wings_render.anchor.set("body");
    //legs
    var model_ = renderer.createResource("MODEL", "shp:gen_rex/build_boots");
    model_.texture.set("build_boots_texture");

    model_left_render = renderer.createEffect("fiskheroes:model").setModel(model_);
    model_left_render.anchor.set("leftLeg");

    model_right_render = renderer.createEffect("fiskheroes:model").setModel(model_);
    model_right_render.anchor.set("rightLeg");
    //goggles
    helmet = _helmet.createFaceplate(renderer, "mask", null);
    //sword
    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "shp:gen_rex/build_sword", "build_sword_texture", null));
    sword.anchor.set("rightArm");
    //smack hand right
    smack_right_hand = renderer.createEffect("fiskheroes:model");
    smack_right_hand.setModel(utils.createModel(renderer, "shp:gen_rex/build_smack_left_hand", "build_smack_hands_texture", null));
    smack_right_hand.anchor.set("rightArm");
    //smack hand left
    smack_left_hand = renderer.createEffect("fiskheroes:model");
    smack_left_hand.setModel(utils.createModel(renderer, "shp:gen_rex/build_smack_right_hand", "build_smack_hands_texture", null));
    smack_left_hand.anchor.set("leftArm");

    cure_beam = utils.createLines(renderer, "fiskheroes:line", 0x87EBE3, [{
                    "start": [-0.060, 0.55, -0.43],
                    "end": [-0.060, 0.5, -2.15],
                    "size": [0.4, 0.4]
                }
            ]);
    cure_beam.anchor.set("rightArm");
    cure_beam.mirror = true;
    cure_beam.setScale(16.0);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.isWearingFullSuit()) {
        if (entity.getData("fiskheroes:flying")) {
            wings_render.setRotation(0, 0, 0);
            wings_render.setOffset(0, 0, 0);
            wings_render.setScale(0, 0, 0);
            wings_render.render();
        }
        if (entity.getData("shp:dyn/charged_jump_visual_timer") > 0) {
            model_left_render.render();
            model_left_render.opacity = entity.getInterpolatedData("shp:dyn/charged_jump_visual_timer");
            model_right_render.render();
            model_right_render.opacity = entity.getInterpolatedData("shp:dyn/charged_jump_visual_timer");
        }

        if (entity.getData("shp:dyn/gex_rex_blade_timer") > 0) {
            sword.opacity = entity.getInterpolatedData("shp:dyn/gex_rex_blade_timer");
            if (isFirstPersonArm) {
                sword.setRotation(87, -40, -60);
                sword.setOffset(10, -100, 1);
            } else {
                sword.setRotation(0, 0, 0);
                sword.setOffset(-8, -3, 1);
            }
            sword.render();
        }

        if (entity.getData("shp:dyn/gex_rex_smack_hands_timer") > 0) {
            smack_left_hand.opacity = entity.getInterpolatedData("shp:dyn/gex_rex_smack_hands_timer");
            smack_right_hand.opacity = entity.getInterpolatedData("shp:dyn/gex_rex_smack_hands_timer");
            if (isFirstPersonArm) {
                smack_left_hand.setRotation(87, -40, -60);
                smack_left_hand.setOffset(10, -100, 1);
                smack_right_hand.setRotation(87, -40, -60);
                smack_right_hand.setOffset(10, -100, 1);
            } else {
                smack_left_hand.setRotation(0, 0, 0);
                smack_left_hand.setOffset(6, -3, 1);
                smack_right_hand.setRotation(0, 0, 0);
                smack_right_hand.setOffset(8, -3, 1);
            }
            smack_left_hand.render();
            smack_right_hand.render();
        }

    }
    cure_beam.progress = entity.getInterpolatedData("fiskheroes:cryo_charge");
    cure_beam.render();
    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity.getInterpolatedData("shp:dyn/gen_rex_goggles"));
        }
    }
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "gen_rex.FLIGHT", "fiskheroes:flight/propelled.anim.json")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    })
    .priority = -10;

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
    .priority = 10;
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE_ROLL", "fiskheroes:falcon_dive_roll");
}
