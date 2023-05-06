var putting_on_suit = 4;
function init(hero) {
    hero.setName("Black Panther/\u00A7d\u00A7lSHHP\u00A7r");
    hero.setAliases("bp_movie", "bpm", "bpmovie");
    hero.setTier(7);

    hero.setChestplate("Necklace");

    hero.addPowers("shp:vibranium_nanites_suit", "fiskheroes:heart_shaped_herbs");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);

    hero.addKeyBind("BLADE", "key.claws", 1);
    hero.addKeyBindFunc("_ENERGY_PROJECTION", kinetic_energy, "Redistribute Kinetic Energy", 2);
    hero.addKeyBind("WAKANDA_FOREVER", "WAKANDA FOREVER!", 3);
    hero.addKeyBind("NANITE_TRANSFORM", "key.naniteTransform", 5);

    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("CLAWS", clawsProfile);
    hero.addAttributeProfile("KINETIC", kineticProfile);
    hero.addAttributeProfile("KINETIC_CLAWS", kineticclawsProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);

    hero.setTickHandler((entity, manager) => {
        if (entity.getData("shp:dyn/1float_reset") < putting_on_suit) {
            manager.setData(entity, "shp:dyn/1float_reset", entity.getData("shp:dyn/1float_reset") + 0.1);
        }
        // energy projection
        if (entity.getData("shp:dyn/kinetic_energy_cooldown") >= 1) {
            manager.setData(entity, "shp:dyn/kinetic_energy_use", true);
        }

        if (entity.getData("fiskheroes:energy_projection") != entity.getData("shp:dyn/kinetic_energy_use_timer") > 0.5) {
            manager.setData(entity, "fiskheroes:energy_projection", entity.getData("shp:dyn/kinetic_energy_use_timer") > 0.5);
            manager.setData(entity, "shp:dyn/kinetic_energy_cooldown", 0);
        }
        // being damaged
        if (entity.getData("shp:dyn/nanites_timer") == 1) {
            if (entity.getData("fiskheroes:time_since_damaged") < 20 && entity.getData("shp:dyn/1float_reset") > putting_on_suit && !entity.getData("shp:dyn/kinetic_energy")) {
                manager.setData(entity, "shp:dyn/kinetic_energy", true);
            } else if (entity.getData("fiskheroes:time_since_damaged") > 20 && entity.getData("shp:dyn/kinetic_energy")) {
                manager.setData(entity, "shp:dyn/kinetic_energy", false);
            }
        }
    });
}

function inactiveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 6.0, 0);
}

function clawsProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8.5, 0);
}

function kineticProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("KNOCKBACK", 5.0, 0);
}

function kineticclawsProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("KNOCKBACK", 5.0, 0);
    profile.addAttribute("PUNCH_DAMAGE", 8.5, 0);
}

function getAttributeProfile(entity) {
    if (!entity.getData("shp:dyn/nanites")) {
        return "INACTIVE";
    }

    return entity.getData("fiskheroes:blade") ? "CLAWS" : null;
}

function getAttributeProfile(entity) {
    return !entity.getData("shp:dyn/nanites") ? "INACTIVE" : null || entity.getData("shp:dyn/nanites_timer") == 1 && entity.getData("fiskheroes:blade") && !entity.getData('fiskheroes:energy_projection') ? "CLAWS" : null || entity.getData('fiskheroes:energy_projection') && entity.getData('shp:dyn/kinetic_energy_cooldown') > 0.5 && entity.getInterpolatedData('shp:dyn/nanites_timer') == 1 && !entity.getData('fiskheroes:mask_open_timer2') > 0 && !entity.getData("fiskheroes:blade") ? "KINETIC" : null || entity.getData('fiskheroes:energy_projection') && entity.getData("shp:dyn/kinetic_energy_cooldown") > 0.5 && entity.getInterpolatedData('shp:dyn/nanites_timer') == 1 && !entity.getData('fiskheroes:mask_open_timer2') > 0 && entity.getData("fiskheroes:blade") ? "KINETIC_CLAWS" : null;
}

function getTierOverride(entity) {
    return entity.getData("shp:dyn/nanites") ? 7 : 2;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:blade":
        return entity.getData("shp:dyn/nanites_timer") == 1;
    case "fiskheroes:projectile_immunity":
        return entity.getData("shp:dyn/nanites_timer") == 1;
    case "fiskheroes:fire_resistance":
        return entity.getData("shp:dyn/nanites_timer") == 1;
    case "fiskheroes:damage_resistance":
        return entity.getData("shp:dyn/nanites_timer") == 1;
    case "fiskheroes:energy_projection":
        return entity.getData("shp:dyn/nanites_timer") == 1;
    case "fiskheroes:cooldown":
        switch (modifier.id()) {
        case "kinectic_full":
            return entity.getData("shp:dyn/kinetic_energy_cooldown") >= 0.8;
        case "kinectic":
            return entity.getData("shp:dyn/kinetic_energy_cooldown") < 0.8;
        }
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "BLADE":
        return entity.getData("shp:dyn/nanites_timer") == 1;
    case "NANITE_TRANSFORM":
        return entity.getData("fiskheroes:mask_open_timer") == 0;
    case "_ENERGY_PROJECTION":
        return entity.getData("shp:dyn/kinetic_energy_cooldown") > 0.5 && entity.getInterpolatedData('shp:dyn/nanites_timer') == 1 && !entity.getData('fiskheroes:mask_open_timer2') > 0;
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return entity.getData("shp:dyn/nanites_timer") == 1;
    default:
        return false;
    }
}

function kinetic_energy(entity,manager) {
    manager.setData(entity, "shp:dyn/kinetic_energy_use", true);
    return true;
}
