extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:lex/lex_layer_1",
    "layer2": "shp:lex/lex_layer_2",
    "invis_layer1": "shp:lex/invis_layer_1",
    "invis_layer2": "shp:lex/invis_layer_2",
    "lights": "shp:lex/lex_lights",
    "repulsor": "shp:lex/lex_repulsor",
    "full_model": "shp:lex/fullLexosuit",
    "repulsor_lights": "shp:lex/lex_repulsor_lights",
    "nothing": "shp:blank"
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

    var model = renderer.createResource("MODEL", "shp:repulsor");
    model.bindAnimation("shp:repulsor").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:aiming_timer")));
    model.texture.set("repulsor", "repulsor_lights");

    gun = renderer.createEffect("fiskheroes:model").setModel(model);
    gun.anchor.set("rightArm");

    var model_full_suit = renderer.createResource("MODEL", "shp:lex/fullLexosuit");
    model_full_suit.bindAnimation("shp:lex/transforming_suit_model").setData((entity, data) => data.load(1));
    model_full_suit.texture.set("full_model");
    full_suit = renderer.createEffect("fiskheroes:model").setModel(model_full_suit);
    full_suit.anchor.set("rightLeg");
    full_suit.setScale(1);

    suit_body = renderer.createEffect("fiskheroes:model");
    suit_body.setModel(utils.createModel(renderer, "shp:lex/Body", "full_model", null));
    suit_body.anchor.set("body");
    suit_body.setScale(1);

    var leg_model = renderer.createResource("MODEL", "shp:lex/Legs");
    leg_model.texture.set("full_model");
    leg_model.generateMirror();

    suit_legs = renderer.createEffect("fiskheroes:model").setModel(leg_model);
    suit_legs.anchor.set("rightLeg");
    suit_legs.setScale(1);
    suit_legs.mirror = true;

    var arms_model = renderer.createResource("MODEL", "shp:lex/Arms");
    arms_model.texture.set("full_model");
    arms_model.generateMirror();

    suit_arms = renderer.createEffect("fiskheroes:model").setModel(arms_model);
    suit_arms.anchor.set("leftArm");
    suit_arms.setScale(1);
    suit_arms.mirror = true;

    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        return 0.99999;
        //return 1.0;
    });

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:repulsor_blast", "rightArm", 0x2AAE13, [{
                "firstPerson": [-3.75, 2.3, -6.0],
                "offset": [-3.5, 10.0, -0.25],
                "size": [0.5, 0.5]
            }
        ])

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "body", 0x2AAE13, [{
                "firstPerson": [-3.75, -120, -40.0],
                "offset": [-3.5, -200.0, 400],
                "size": [3, 3]
            }
        ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "shp:impact_orbital_satellite"));
}
function render(entity, renderLayer, isFirstPersonArm) {
    var data1 = entity.getData("shp:dyn/lexmech_timer");
    if (data1 == 0) {
        gun.render();
    }

    if (entity.isWearingFullSuit()) {
        if (data1 > 0 && data1 < 1) {
            full_suit.setOffset(-2,-1,2);
            full_suit.render();
        }
        if (data1 == 1) {
            suit_body.render();
            suit_arms.render();
            suit_legs.render();
        }
    }

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");

    addAnimationWithData(renderer, "lex.TRANSFORMING_PLAYER", "shp:lex/transforming_player", "shp:dyn/lexmech_timer")
}
