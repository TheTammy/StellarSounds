extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "shp:dying_symbiote",
    "layer2": "shp:dying_symbiote"
});
// uhm i just did this as i didnt know whats wanted

function init(renderer) {
    parent.init(renderer);
    
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}