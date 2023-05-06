extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "shp:spectacular_spider_man_layer_1",
    "layer2": "shp:spectacular_spider_man_layer_2",
    "symbiote_1": "shp:spectacular_spider_man_symbiote_1st_stage",
    "symbiote_2": "shp:spectacular_spider_man_symbiote_2nd_stage",
    "symbiote_3": "shp:spectacular_spider_man_symbiote_final",
    "web_wings": "fiskheroes:spider_man_wings",
    "scare_hud": "shp:golden_freddy",
    "web_rope": "shp:spectacular/web_rope.tx.json",
    "web_small": "shp:spectacular/web_small.tx.json",
    "web_large": "shp:spectacular/web_large.tx.json",
    "hide": "shp:hide"
});

var web_wings;
var scare_hud;
var hide;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.isDisplayStand() && !entity.isBookPlayer() && entity.isWearingFullSuit()) {
            if (entity.getInterpolatedData('shp:dyn/symbiosis_timer') > 0) {
                if (entity.getData('shp:dyn/symbiosis_stage_3_timer') > 0) {
                    return "symbiote_3";
                } else if (entity.getData('shp:dyn/symbiosis_stage_2_timer') > 0) {
                    return "symbiote_2";
                }
                return "symbiote_1";
            }
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x808080);

    web_wings = renderer.createEffect("fiskheroes:wingsuit");
    web_wings.texture.set("web_wings");
    web_wings.opacity = 0.99;

    webs = renderer.bindProperty("fiskheroes:webs");

    webs.textureRope.set("web_rope", null);
    webs.textureSmall.set("web_small", null);
    webs.textureLarge.set("web_large", null);
    webs.textureRopeBase.set("web_large", null);

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x6F8EBF);

    scare_hud = renderer.createEffect("fiskheroes:model");
    scare_hud.setModel(utils.createModel(renderer, "shp:jumpscare_hud", "scare_hud", null));
    scare_hud.anchor.set("rightArm");
    scare_hud.anchor.ignoreAnchor(true);
    scare_hud.setOffset(6, -4.8, 1);
    scare_hud.setScale(0.2, 0.15, 1);

    hide = renderer.createEffect("fiskheroes:model");
    hide.setModel(utils.createModel(renderer, "shp:hide", "hide", null));
    hide.anchor.set("rightArm");
    hide.anchor.ignoreAnchor(true);

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
}

function render(entity, renderLayer, isFirstPersonArm) {
    var scare = entity.getData("shp:dyn/scare_in_use");
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        web_wings.unfold = entity.getInterpolatedData("fiskheroes:wing_animation_timer");
        web_wings.render();
    }
    if (isFirstPersonArm && true) {
        if (scare == 1) {
            scare_hud.render();
            hide.render();
        }
        if (scare == 2) {
            scare_hud.render();
        }
    }
}
