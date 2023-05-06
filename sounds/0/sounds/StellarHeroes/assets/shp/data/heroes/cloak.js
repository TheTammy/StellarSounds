function init(hero) {
    hero.setName("Cloak Of Levitation");
    hero.setTier(1);

    hero.setChestplate("Cape");

    hero.addPowers("fiskheroes:cloak_of_levitation");
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.5, 0);

    hero.setTickHandler((entity, manager) => {
        // uuid lock
        var nbt = entity.getWornChestplate().nbt();
        /** */
        if (entity.is("PLAYER") && nbt.getString("uuid") == "") {
            var display = manager.newCompoundTag('{Lore:[' + entity.getName() + ']}');
            manager.setCompoundTag(nbt, "display", display);
            manager.setString(nbt, "uuid", entity.getUUID());
        }
        // if falling then fly
        if (!entity.isSneaking() && !entity.isOnGround() && entity.motionY() < -0.8) {
            manager.setData(entity, "fiskheroes:flying", true);
        }
    });

    hero.setModifierEnabled(isModifierEnabled);
    hero.setTierOverride(getTierOverride);

    hero.setAttributeProfile(entity => entity.getWornChestplate().nbt().getString("uuid") != entity.getUUID() ? "EMPTY" : null);
    hero.addAttributeProfile("EMPTY", profile => {
        profile.revokeAugments();
    });

    hero.setTierOverride(getTierOverride);
}

function getTierOverride(entity) {
    return entity.getWornChestplate().nbt().getString("uuid") != entity.getUUID() ? 0 : 1;
}

function isModifierEnabled(entity) {
    return entity.getWornChestplate().nbt().getString("uuid") != entity.getUUID() ? false : true;
}
