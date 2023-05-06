var DC = Java.type('com.fiskmods.heroes.common.DimensionalCoords');
function init(hero) {
    hero.setName("Danny Phantom");
    hero.setTier(8);

    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("shp:phantom_physiology");

    hero.addAttribute("PUNCH_DAMAGE", 14, 0);
    hero.addAttribute("FALL_RESISTANCE", 1, 1);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("JUMP_HEIGHT", 3.0, 0);
    hero.addAttribute("STEP_HEIGHT", 1, 0);

    hero.addKeyBind("AIM", "Aim", 1);

    hero.addKeyBind("ENERGY_PROJECTION", "Ecto Beam", -1);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", -1);

    hero.addKeyBind("INVISIBILITY", "key.invisibility", 2);

    hero.addKeyBind("SONIC_WAVES", "Ghostly Wail", 3);

    hero.addKeyBind("CHARGED_BEAM", "Cold Beam", 4);

    hero.addKeyBind("GHOST_TRANSFORM", "Ghost Transform", 5);

    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setModifierEnabled(isModifierEnabled);

    hero.setHasProperty(hasProperty);

    hero.setTierOverride(getTierOverride);

    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.setAttributeProfile(getProfile);

    hero.supplyFunction("canAim", canAim);

    hero.setTickHandler((entity, manager) => {
        //moon
        if (entity.posY() > 2000) {
            manager.setData(entity, "fiskheroes:teleport_dest", new DC(entity.posX(), entity.posY(), entity.posZ(), entity.world().getDimension() + 1));
            manager.setData(entity, "fiskheroes:teleport_delay", 1);
        }
        //transforming
        if (entity.getData("shp:dyn/danny_phantom_transform_timer") != 0
             && entity.getData("shp:dyn/danny_phantom_transform_timer") != 1 && entity.getData("shp:dyn/danny_phantom_transform_timer") != 1) {
            manager.setData(entity, "shp:dyn/danny_phantom_transformed_timer", 1);
        } else if ((entity.getData("shp:dyn/danny_phantom_transform_timer") == 0
                 || entity.getData("shp:dyn/danny_phantom_transform_timer") == 1) && entity.getData("shp:dyn/danny_phantom_transformed_timer") != 0) {
            manager.setData(entity, "shp:dyn/danny_phantom_transformed_timer", Math.min(Math.max(entity.getData("shp:dyn/danny_phantom_transformed_timer") - 0.6, 0), 1));
        }
        // intangible
        if (entity.getData("fiskheroes:invisible") != entity.getData("fiskheroes:intangible")) {
            manager.setData(entity, "fiskheroes:intangible", entity.getData("fiskheroes:invisible"))
        }
        if (entity.getData("fiskheroes:intangible")) {
            if (!entity.isSneaking()) {
                manager.setData(entity, "fiskheroes:flying", true);
            }
            manager.setData(entity, "fiskheroes:shield", true);
            manager.setData(entity, "fiskheroes:shield_blocking", true);

        }
        // shield aim
        if ((entity.getData("fiskheroes:aiming") != entity.getData("fiskheroes:shield")) && entity.getData("fiskheroes:invisibility_timer") == 0) {
            manager.setData(entity, "fiskheroes:shield", entity.getData("fiskheroes:aiming_timer") == 1);
        }
    });

}

function isKeyBindEnabled(entity, keyBind) {
    if ((!entity.getData("shp:dyn/danny_phantom_transform") && keyBind != "GHOST_TRANSFORM" || entity.isSprinting() && entity.getData("fiskheroes:flying") && keyBind != "INTANGIBILITY" &&
            keyBind != "INVISIBILITY" && keyBind != "TELEKINESIS") || entity.getData("fiskheroes:invisibility_timer") > 0 && keyBind != "INVISIBILITY") {
        return false;
    }
    var aiming = entity.getData("fiskheroes:aiming_timer") == 1;
    switch (keyBind) {
    case "TELEKINESIS":
        return aiming && entity.isSneaking() && entity.getData("fiskheroes:shield_blocking_timer") == 0;
    case "ENERGY_PROJECTION":
        return aiming && !entity.isSneaking();
    }
    return true;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("shp:dyn/danny_phantom_transform") || modifier.name() == "fiskheroes:propelled_flight" && entity.getData("shp:dyn/danny_phantom_transform") < 1)) {
        return false;
    }
    var aiming = entity.getData("fiskheroes:aiming_timer") == 1;
    switch (modifier.name()) {
    case "fiskheroes:repulsor_blast":
        return aiming && !entity.isSneaking() && entity.getData("fiskheroes:energy_projection_timer") == 0;
    case "fiskheroes:shield":
        return (modifier.id() == "aim") && aiming && entity.isSneaking() && entity.getData("fiskheroes:invisibility_timer") == 0 ||
        (modifier.id() == "intangible") && entity.getData("fiskheroes:invisibility_timer") > 0;
    case "fiskheroes:fire_immunity":
        return entity.getData("fiskheroes:invisibility_timer") > 0;
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" && entity.getData("shp:dyn/danny_phantom_transform");
}

function getTierOverride(entity) {
    return entity.getData("shp:dyn/danny_phantom_transform") ? 8 : 0;
}

function inactiveProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("STEP_HEIGHT", 1, 0);
}

function getProfile(entity) {
    return entity.getData("shp:dyn/danny_phantom_transform") ? null : "INACTIVE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:sonic_waves") && entity.getData("fiskheroes:beam_charge") == 0;
}
