extend("fiskheroes:hero_basic");
loadTextures({
    "base": "shp:quantum_suit",
    "suit": "shp:quantum_suit_suit.tx.json",
    "mask": "shp:quantum_suit_mask.tx.json",
    "mask_lights": "shp:quantum_suit_mask_lights.tx.json",
    "qr_band": "shp:quantum_suit_band",
    "blank": "shp:blank",
    "nomask": "shp:quantum_suit_nomask"
});

var utils = implement("fiskheroes:external/utils");
var helmet;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.isDisplayStand()) {
            if (entity.getInterpolatedData('shp:dyn/suit_timer') == 0) {
                return "qr_band";
            }
            if (entity.getInterpolatedData('shp:dyn/suit_timer') < 1) {
                return "suit";
            }
        }
        return "nomask";
    });

    renderer.setLights((entity, renderLayer) => {
        return "blank";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    helmet = renderer.createEffect("fiskheroes:overlay");
    helmet.texture.set("mask", "mask_lights");
    helmet.opacity = 1;

}


function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm) {
            helmet.render();
    }
}
