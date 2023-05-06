function init(hero) {
    hero.setName("Wasp");
    hero.setTier(6);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    //add base mod pym particles and split powers
    hero.addPowers("shp:wasps_suit");
    hero.addAttribute("PUNCH_DAMAGE", 5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.2, 0);
    hero.addAttribute("JUMP_HEIGHT", 2, 0);
    hero.addAttribute("FALL_RESISTANCE", 4, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);

    hero.addKeyBind("SIZE_MANIPULATION", "key.sizeManipulation", 1);
    hero.addKeyBind("AIM", "Aim", 2);
    hero.addKeyBind("MINIATURIZE_SUIT", "key.miniaturizeSuit", 3);

    hero.setHasProperty(hasProperty);

    hero.supplyFunction("canAim", canAim);

    hero.setModifierEnabled(isModifierEnabled);

    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setTickHandler((entity, manager) => {
        var flap = entity.getData("shp:dyn/wasp_flap");
        manager.setData(entity, "shp:dyn/wasp_flap", flap + 0.4);
    });
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return entity.world().getDimension() == 2594 || entity.getData("fiskheroes:scale") != 1.0;
    case "fiskheroes:size_manipulation":
        return !entity.getData("fiskheroes:mask_open");
    case "fiskheroes:repulsor_blast":
        return entity.getData("fiskheroes:size_state") == 0;
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SIZE_MANIPULATION":
        return !entity.getData("fiskheroes:mask_open");
    default:
        return true;
    }
}
