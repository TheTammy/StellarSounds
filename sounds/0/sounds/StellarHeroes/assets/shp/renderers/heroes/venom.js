extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "shp:spectacular_spider_man_symbiote_base",
    "layer2": "shp:spectacular_spider_man_symbiote_base",
});
// uhm i just did this as i didnt know whats wanted

function init(renderer) {
    parent.init(renderer);
    
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}