extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shp:wasp_layer1",
    "layer2": "shp:wasp_layer2",
    "wings": "shp:wasp_wings.tx.json",
    "blank": "shp:blank",
    "mask": "shp:wasp_mask.tx.json"
});

var utils = implement("fiskheroes:external/utils");
var _helmet = implement("fiskheroes:external/iron_man_helmet");
var helmet;
var chest;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
            return "blank";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);


    var color = 0xFFFF00;
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:cold_beam", "rightArm", color, [{
                "firstPerson": [-4.5, 3.75, -7.0],
                "offset": [-4, 9.0, 0.0],
                "size": [1, 1]
            }
        ]).setCondition(entity => entity.getData("fiskheroes:scale") == 1.0);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:cold_beam", "rightArm", color, [{
        "firstPerson": [-20, 403.75, 100.0],
        "offset": [-4, 9.0, 0.0],
        "size": [0.1, 0.1]
            }
        ]).setCondition(entity => entity.getData("fiskheroes:scale") != 1.0);
        
    var wings = renderer.createResource("MODEL", "shp:Wings");
    wings.bindAnimation("shp:wings_flapping").setData((entity, data) => data.load(entity.getData('fiskheroes:flight_timer') > 0.5
             ? entity.getInterpolatedData("shp:dyn/wasp_flap") * 2 : 0 || entity.getData('fiskheroes:flight_timer') <= 0.5 ? 0.5 : 0));
    wings.texture.set("wings");

    wingsrender = renderer.createEffect("fiskheroes:model").setModel(wings);
    wingsrender.anchor.set("body");

    helmet = _helmet.createFolding(renderer, "mask", null, "fiskheroes:mask_open_timer2");


}


function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "wasp.FLIGHT", "fiskheroes:flight/propelled.anim.json")
    .setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
    })
    .priority = -10;

    renderer.reprioritizeDefaultAnimation("PUNCH", -9);
    renderer.reprioritizeDefaultAnimation("AIM_BOW", -9);
}


function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        wingsrender.render();
    }

    if (!isFirstPersonArm) {
        if (renderLayer == "HELMET") {
            helmet.render(entity);
        }
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
}
