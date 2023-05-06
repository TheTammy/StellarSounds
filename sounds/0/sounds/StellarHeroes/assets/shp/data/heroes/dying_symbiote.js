function init(hero) {
    hero.setName("Dying Symbiote");
    hero.setTier(1);
    hero.hide();

    hero.setChestplate(" ");

    hero.addAttribute("FALL_RESISTANCE", -1, 1);
    hero.addAttribute("JUMP_HEIGHT", -0.3, 0);
    hero.addAttribute("PUNCH_DAMAGE", -0.1, 0);
    hero.addAttribute("SPRINT_SPEED", -0.3, 1);

    hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornChestplate().nbt();
        if (nbt.getInteger("Upgrades") == 1) {
            manager.removeTag(nbt, "Equipment");
            manager.removeTag(nbt, "Upgrades");
            manager.setString(nbt, "HeroType", "shp:venom");

        }
    });
}
