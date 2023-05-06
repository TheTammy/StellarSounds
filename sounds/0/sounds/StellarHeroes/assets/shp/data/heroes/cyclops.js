function init(hero) {
    hero.setName("Cyclops");
    hero.setTier(4);

    hero.setHelmet("Visor");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("shp:ocular_portals");

    hero.addAttribute("PUNCH_DAMAGE", 4, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);

    hero.addKeyBind("CHARGED_BEAM", "Laser Vision", 1);

    hero.setHasProperty(hasProperty);

    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addAttributeProfile("MAX", max);
    hero.addAttributeProfile("ONE", one);
    hero.addAttributeProfile("TWO", two);
    hero.addAttributeProfile("THREE", three);
    hero.addAttributeProfile("FOUR", four);
    hero.addAttributeProfile("FIVE", five);
    hero.addAttributeProfile("SIX", six);
    hero.addAttributeProfile("SEVEN", seven);
    hero.setAttributeProfile(getProfile);

    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:mask_open_timer2") != entity.getData("fiskheroes:heat_vision")) {
            manager.setData(entity, "fiskheroes:heat_vision", entity.getData("fiskheroes:mask_open_timer2") == 1 ? true : false);
        }
        if (!entity.as("PLAYER").isCreativeMode()) {
            if (entity.getData("fiskheroes:mask_open_timer2") == 1) {
                manager.setData(entity, "shp:dyn/cyclops_death", entity.getData("shp:dyn/cyclops_death") + 1);
                if (entity.getData("shp:dyn/cyclops_cooldown") != 0) {
                    manager.setData(entity, "shp:dyn/cyclops_cooldown", 0);
                }
            }
            if (entity.getData("fiskheroes:mask_open_timer2") == 0) {
                manager.setData(entity, "shp:dyn/cyclops_cooldown", entity.getData("shp:dyn/cyclops_cooldown") + 1);
            }
            if ((entity.getData("shp:dyn/cyclops_cooldown") == 50 || !entity.isAlive()) && entity.getData("shp:dyn/cyclops_death") != 0) {
                manager.setData(entity, "shp:dyn/cyclops_death", 0);
            }
        }
    });
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" && entity.getData('fiskheroes:beam_charge') == 0 && entity.isAlive();
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGED_BEAM":
        return entity.getData("fiskheroes:mask_open_timer2") == 0;
    default:
        return true;
    }
}

function max(profile) {
    profile.inheritDefaults();
    profile.addAttribute("MAX_HEALTH", 0, 0);
    profile.addAttribute("SPRINT_SPEED", -100, 0);
    profile.addAttribute("BASE_SPEED", -100, 0);
    profile.addAttribute("JUMP_HEIGHT", -100, 0);
}

function one(profile) {
    profile.inheritDefaults();
    profile.addAttribute("MAX_HEALTH", -3, 0);
    profile.addAttribute("SPRINT_SPEED", -100, 0);
    profile.addAttribute("BASE_SPEED", -100, 0);
    profile.addAttribute("JUMP_HEIGHT", -100, 0);
}

function two(profile) {
    profile.inheritDefaults();
    profile.addAttribute("MAX_HEALTH", -6, 0);
    profile.addAttribute("SPRINT_SPEED", -100, 0);
    profile.addAttribute("BASE_SPEED", -100, 0);
    profile.addAttribute("JUMP_HEIGHT", -100, 0);
}

function three(profile) {
    profile.inheritDefaults();
    profile.addAttribute("MAX_HEALTH", -9, 0);
    profile.addAttribute("SPRINT_SPEED", -100, 0);
    profile.addAttribute("BASE_SPEED", -100, 0);
    profile.addAttribute("JUMP_HEIGHT", -100, 0);
}

function four(profile) {
    profile.inheritDefaults();
    profile.addAttribute("MAX_HEALTH", -12, 0);
    profile.addAttribute("SPRINT_SPEED", -100, 0);
    profile.addAttribute("BASE_SPEED", -100, 0);
    profile.addAttribute("JUMP_HEIGHT", -100, 0);
}

function five(profile) {
    profile.inheritDefaults();
    profile.addAttribute("MAX_HEALTH", -15, 0);
    profile.addAttribute("SPRINT_SPEED", -100, 0);
    profile.addAttribute("BASE_SPEED", -100, 0);
    profile.addAttribute("JUMP_HEIGHT", -100, 0);
}

function six(profile) {
    profile.inheritDefaults();
    profile.addAttribute("MAX_HEALTH", -18, 0);
    profile.addAttribute("SPRINT_SPEED", -100, 0);
    profile.addAttribute("BASE_SPEED", -100, 0);
    profile.addAttribute("JUMP_HEIGHT", -100, 0);
}

function seven(profile) {
    profile.inheritDefaults();
    profile.addAttribute("MAX_HEALTH", -20, 0);
    profile.addAttribute("SPRINT_SPEED", -100, 0);
    profile.addAttribute("BASE_SPEED", -100, 0);
    profile.addAttribute("JUMP_HEIGHT", -100, 0);
}

function getProfile(entity) {
    if (!entity.as("PLAYER").isCreativeMode()) {
        if (entity.getData("shp:dyn/cyclops_death") == 10 && entity.getHealth() > 17) {
            return "ONE";
        }
        if (entity.getData("shp:dyn/cyclops_death") == 20 && entity.getHealth() > 14) {
            return "TWO";
        }
        if (entity.getData("shp:dyn/cyclops_death") == 30 && entity.getHealth() > 11) {
            return "THREE";
        }
        if (entity.getData("shp:dyn/cyclops_death") == 40 && entity.getHealth() > 8) {
            return "FOUR";
        }
        if (entity.getData("shp:dyn/cyclops_death") == 50 && entity.getHealth() > 5) {
            return "FIVE";
        }
        if (entity.getData("shp:dyn/cyclops_death") == 60 && entity.getHealth() > 2) {
            return "SIX";
        }
        if (entity.getData("shp:dyn/cyclops_death") == 70 && entity.getHealth() > 0) {
            return "SEVEN";
        }
    }
    if (entity.getData("fiskheroes:mask_open_timer2")) {
        return "MAX";
    }
    return null;
}
