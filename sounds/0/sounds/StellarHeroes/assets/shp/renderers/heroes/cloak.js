extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:dr_strange_base",
    "cape": "fiskheroes:doctor_strange_cape",
    "shadow_layer1": "shp:cloaks/dr_strange_base_shadow",
    "shadow_cape": "shp:cloaks/doctor_strange_cape_shadow",
    "biz_layer1": "shp:cloaks/dr_strange_base_biz",
    "biz_cape": "shp:cloaks/doctor_strange_cape_biz",
    "skar_layer1": "shp:cloaks/dr_strange_base_skar",
    "skar_cape": "shp:cloaks/doctor_strange_cape_skar",
    "maxime_layer1": "shp:cloaks/trickster_aftermath_layer1",
    "maxime_cape": "shp:cloaks/trickster_cape",
    "maxime_model": "shp:cloaks/trickster_model",
    "cat_cape": "shp:cloaks/cat_cape",
    "cat_layer1": "shp:cloaks/cat_cape_skin",
    "hal_layer1": "shp:cloaks/dr_strange_base_hal",
    "hal_cape": "shp:cloaks/doctor_strange_cape_hal",
    "blank": "shp:blank"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var physics;
var cape;
var maxime_model;

var collar;
function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        var uuid = entity.getWornChestplate().nbt().getString("uuid");
        if ((entity.isBookPlayer() || entity.isDisplayStand() || uuid == entity.getUUID())) {
            if (uuid == /*HelloImShadow*/ "ccce6704-56a0-49a9-967c-e7b1c9db0711" || uuid == /*shadow00dev*/ "9de0bbe9-dbc4-40f0-b7e7-df2ed4a47716") {
                return "shadow_layer1";
            } else if (uuid == /*BizDC*/ "07001d5c-f62a-421f-80dd-87ad43461ce8" || uuid == /*Yehaa*/ "e0266f4e-9167-4566-827e-3472b946ef5b") {
                return "biz_layer1";
            } else if (uuid == /*skarpc2*/ "7047f78e-059b-4a0c-a8f1-278a1da9df7e") {
                return "skar_layer1";
            } else if (uuid == /*78maxime*/ "7a3c38cd-cf2f-42d6-9662-8057a7204e01") {
                return "maxime_layer1";
            } else if (uuid == /*_Waffle_Warrior_*/ "16d4ddfa-6a5a-4bb0-92ab-9238bfbc8fe9") {
                return "cat_layer1";
            } else if (uuid == /*Halcyon_OW*/ "79605557-3bf6-44c4-913b-fa75ca547066") {
                return "hal_layer1";
            }
            return "layer1";
        }
        return "blank";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.2;
    physics.maxFlare = 1;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.5;
    physics.flareElasticity = 8;
    physics.setTickHandler(entity => {
        var f = 1 - entity.getData("fiskheroes:flight_timer");
        f = 1 - f * f * f;
        physics.headingAngle = 90 - f * 20;
        physics.restAngle = f * 40;
        physics.restFlare = f * 0.7;
        physics.idleFlutter = 0.15 + 0.25 * f;
        physics.flutterSpeed = f * 0.3;
    });

    cape = capes.create(renderer, 24, "fiskheroes:cape_default.mesh.json");

    collar = renderer.createEffect("fiskheroes:ears");
    collar.anchor.set("head");
    collar.angle = -7;
    collar.inset = -0.065;

    maxime_model = renderer.createEffect("fiskheroes:model");
    maxime_model.setModel(utils.createModel(renderer, "shp:trickster_colar", "maxime_model"));
    maxime_model.anchor.set("head");

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    utils.addHoverAnimation(renderer, "strange.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addFlightAnimation(renderer, "strange.FLIGHT", "fiskheroes:flight/levitate.anim.json", (entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    var uuid = entity.getWornChestplate().nbt().getString("uuid");
    if ((entity.isBookPlayer() || entity.isDisplayStand() || uuid == entity.getUUID())) {
        cape.effect.texture.set("cape");
        if (uuid == /*HelloImShadow*/ "ccce6704-56a0-49a9-967c-e7b1c9db0711" || uuid == /*shadow00dev*/ "9de0bbe9-dbc4-40f0-b7e7-df2ed4a47716") {
            cape.effect.texture.set("shadow_cape");
        } else if (uuid == /*BizDC*/ "07001d5c-f62a-421f-80dd-87ad43461ce8" || uuid == /*Yehaa*/ "e0266f4e-9167-4566-827e-3472b946ef5b") {
            cape.effect.texture.set("biz_cape");
        } else if (uuid == /*skarpc2*/ "7047f78e-059b-4a0c-a8f1-278a1da9df7e") {
            cape.effect.texture.set("skar_cape");
        } else if (uuid == /*78maxime*/ "7a3c38cd-cf2f-42d6-9662-8057a7204e01") {
            maxime_model.render();
            cape.effect.texture.set("maxime_cape");
        } else if (uuid == /*_Waffle_Warrior_*/ "16d4ddfa-6a5a-4bb0-92ab-9238bfbc8fe9") {
            cape.effect.texture.set("cat_cape");
        } else if (uuid == /*Halcyon_OW*/ "79605557-3bf6-44c4-913b-fa75ca547066") {
            cape.effect.texture.set("hal_cape");
        }
    }
    if (!isFirstPersonArm) {
        if (uuid != /*78maxime*/ "7a3c38cd-cf2f-42d6-9662-8057a7204e01") {
            collar.render();
        }
        var f = entity.getInterpolatedData("fiskheroes:flight_timer");
        cape.render({
            "wind": 1 + 0.3 * f,
            "windFactor": 1 - 0.7 * f,
            "flutter": physics.getFlutter(entity),
            "flare": physics.getFlare(entity)
        });
    }
}
