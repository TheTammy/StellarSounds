var DC = Java.type('com.fiskmods.heroes.common.DimensionalCoords');
function init(hero) {
    hero.setName("Black Adam");
    hero.setTier(9);

    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("shp:egyptian_empowerment");
    hero.addAttribute("PUNCH_DAMAGE", 11, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.7, 0);
    hero.addAttribute("SPRINT_SPEED", 0.75, 1);
    hero.addAttribute("JUMP_HEIGHT", 2, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Lightning Beam", 2);

    hero.setDefaultScale(1.1);
    hero.setModifierEnabled(isModifierEnabled);

    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "MAGIC": 0.8
        }
    });

    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setTickHandler((entity, manager) => {
        if (entity.posY() > 2000) {
            manager.setData(entity, "fiskheroes:teleport_dest", new DC(entity.posX(), entity.posY(), entity.posZ(), entity.world().getDimension() + 1));
            manager.setData(entity, "fiskheroes:teleport_delay", 1);
        }
    });
    hero.addSoundEvent("MASK_OPEN", "shp:rock");
    hero.setHasProperty(hasProperty);
}

function getDamageProfile(entity) {
    return !entity.getHeldItem().isWeapon() ? "PUNCH" : null;
}
function isKeyBindEnabled(entity, keyBind) {
    if ((entity.isSprinting() || keyBind == "SUPER_SPEED") && entity.getData("fiskheroes:flying") || entity.hasStatusEffect("fiskheroes:eternium")) {
        return false;
    }
    return true;

}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:lightning_cast":
        return !entity.getData("fiskheroes:energy_projection") && !entity.hasStatusEffect("fiskheroes:eternium");
    case "fiskheroes:super_speed":
        return !entity.getData("fiskheroes:flying") && !entity.hasStatusEffect("fiskheroes:eternium");
    default:
        return modifier.name() == "fiskheroes:eternium_weakness" || !entity.hasStatusEffect("fiskheroes:eternium");
    }
}
function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}
