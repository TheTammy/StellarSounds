extend("fiskheroes:hero_basic");
loadTextures({
    "kinetic": "shp:black_panther_kinetic",
    "base": "shp:black_panther",
    "suit": "shp:black_panther_suit.tx.json",
    "mask": "shp:black_panther_mask.tx.json",
    "necklace": "shp:black_panther_necklace",
    "claws": "shp:black_panther_claws"
});

var utils = implement("fiskheroes:external/utils");
var overlay;
var overlay_energy;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.isDisplayStand() && !entity.isBookPlayer()) {
            if (entity.getInterpolatedData('shp:dyn/nanites_timer') == 0) {
                return "necklace";
            }
            if (entity.getInterpolatedData('shp:dyn/nanites_timer') < 1) {
                return "suit";
            }
        }
        return "mask";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("claws");

    overlay_energy = renderer.createEffect("fiskheroes:overlay");
    overlay_energy.texture.set("kinetic");

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xB72CD3);
    forcefield.setOffset(0.0, 6.0, 0.0)
    forcefield.setCondition(entity => {
        forcefield.opacity = Math.min(entity.getInterpolatedData("shp:dyn/kinetic_energy_use_timer") * 1.5, 1);
        forcefield.setScale(entity.getInterpolatedData("shp:dyn/kinetic_energy_use_timer") * 3);
        return true;
    });

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "shp:invis", "body", 0x000000, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:blade")) {
        overlay.render();
    }
    overlay_energy.opacity = entity.getData('shp:dyn/nanites_timer') == 1 ? entity.getData("shp:dyn/kinetic_energy_cooldown") : 0;
    overlay_energy.render();
}
 
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    
    addAnimationWithData(renderer, "WAKANDA FOREVER", "shp:wakanda_forever", "shp:dyn/wakanda_forever_timer");
}