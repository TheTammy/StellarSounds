var shp_utils = implement("shp:external/utils");
var health_lose_timer = 10;
var health_lose_timer_speed = 1;
var metal_heat_lose_timer = 0.004;
var ammount = 1; //lowest must be 0.3

function lore(entity, target, manager) {
    var nbt = entity.getWornChestplate().nbt();
    var targetX = String(Math.floor(target.posX()));
    var targetY = String(Math.floor(target.posY()));
    var targetZ = String(Math.floor(target.posZ()));
    var Distance = String(Math.round(entity.pos().distanceTo(target.posX(), target.posY(), target.posZ())));
    var lore = manager.newCompoundTag("{Lore:[" + "\u00A7r\u00A7b| X " + targetX + "," + "\u00A7r\u00A7b| Y " + targetY + "," + "\u00A7r\u00A7b| Z " + targetZ + "," +
            "\u00A7r\u00A7b| Distance " + Distance + "]}");
    manager.setCompoundTag(nbt, "display", lore);
}
function init(hero) {
    hero.setName("Spider-Man");
    hero.setVersion("Unlimited");
    hero.setTier(8);

    hero.setChestplate("WristMorpher");

    hero.addPowers("shp:spider_physiology", "shp:nanite_suit");
    hero.addAttribute("FALL_RESISTANCE", 16.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 3.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.60, 1);
    hero.addAttribute("BASE_SPEED", 0.2, 1);
    hero.addAttribute("STEP_HEIGHT", 0.6, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.7, 1);

    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);

    hero.addKeyBind("TENTACLE_GRAB", "Tracking", 3);
    hero.addKeyBindFunc("Func_REMOVE_TRACKER", remove_tracker, "Remove Tracker", 3);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotionHold", 4);

    hero.addKeyBind("AIM", "Aim Darts", 1);
    hero.addKeyBind("SHIELD", "Web Shield", 2);
    hero.addKeyBind("SHIELD_CHARGE", "Web Shield", 2);

    hero.addKeyBindFunc("Func_INVISIBLE", toggleInvisible, "key.invisibility", 4);
    hero.addKeyBind("CHARGED_BEAM", "Sonics", 4);

    hero.addKeyBind("NANITE_TRANSFORM", "key.naniteTransform", 5);

    hero.addKeyBindFunc("Func_CYCLE1", keybind_cycle, "Activate Gadgets", 5);
    hero.addKeyBind("TENTACLES", "Activate Gadgets", 5);
    hero.addKeyBindFunc("Func_CYCLE2", keybind_cycle, "Deactivate Gadgets", 5);

    for (var i = 20; i > 0; i--) {
        hero.addAttributeProfile(String(i), profile => {
            profile.inheritDefaults();
            profile.addAttribute("MAX_HEALTH", -i, 0);
        });
    }

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addAttributeProfile("SUITOFF", suitOffProfile);
    hero.setAttributeProfile(getProfile);
    hero.setHasProperty(hasProperty);

    hero.setTierOverride(getTierOverride);
    hero.supplyFunction("canAim", canAim);

    hero.setTickHandler((entity, manager) => {
        var data = (entity.getData("shp:dyn/integer") + 1);
        shp_utils.tick_handler_invisible(entity, manager, 0.05, 0.8, 0.05);
        if ((entity.getData("fiskheroes:dyn/nanite_timer") < 1 || entity.getData("shp:dyn/health_lose") > 21 || data == 1) && entity.getData("shp:dyn/invisible")) {
            shp_utils.reset_invisible(entity, manager);
        }

        if (entity.getData("fiskheroes:dyn/nanites") && entity.getData("fiskheroes:dyn/nanite_timer") >= 0.5 && entity.getData("shp:dyn/cape_float") < 1) {
            manager.setData(entity, "shp:dyn/cape_float", entity.getData("shp:dyn/cape_float") + 0.1);
        }
        if (!entity.getData("fiskheroes:dyn/nanites") && entity.getData("fiskheroes:dyn/nanite_timer") < 1 && entity.getData("shp:dyn/cape_float") > 0) {
            manager.setData(entity, "shp:dyn/cape_float", entity.getData("shp:dyn/cape_float") - 0.1);
        }

        if ((entity.getData("shp:dyn/invisible_float") > 0 && entity.getData("shp:dyn/invisible") || entity.getData("fiskheroes:beam_charging")) && entity.getData("fiskheroes:metal_heat") < 1.0) {
            manager.setData(entity, "fiskheroes:metal_heat", entity.getData("fiskheroes:metal_heat") + (entity.getData("fiskheroes:beam_charging") ? metal_heat_lose_timer + 0.003 : metal_heat_lose_timer));
        }
        if (entity.getData("shp:dyn/health_lose_timer") < health_lose_timer && (entity.getData("shp:dyn/invisible_float") > 0 || entity.getData("fiskheroes:beam_charging")) && entity.getData("fiskheroes:metal_heat") >= 1.0) {
            manager.setData(entity, "shp:dyn/health_lose_timer", entity.getData("shp:dyn/health_lose_timer") + health_lose_timer_speed);
        }
        if (entity.getData("shp:dyn/health_lose_timer") >= health_lose_timer) {
            manager.setData(entity, "shp:dyn/health_lose", entity.getData("shp:dyn/health_lose") + 1);
            manager.setData(entity, "shp:dyn/health_lose_timer", 0);
        }
        if (entity.getData("fiskheroes:metal_heat") < 1.0 && entity.getData("shp:dyn/health_lose") != 0) {
            manager.setData(entity, "shp:dyn/health_lose", 0);
        }

        // cylcer
        var data1 = entity.getData("shp:dyn/integer");
        var data2 = "shp:dyn/boolean";
        if (entity.getData(data2)) {
            manager.setData(entity, "shp:dyn/integer", data1 == 1 ? 0 : data1 + 1);
            manager.setData(entity, data2, false);
        }
        if (entity.getData("fiskheroes:dyn/nanite_timer") < 1 && data1 != 0) {
            manager.setData(entity, "shp:dyn/integer", 0);
            manager.setData(entity, data2, false);
        }
        // tracer
        if (entity.getData("fiskheroes:grab_id") > -1) {
            if (entity.getData("shp:dyn/float_reset") < ammount) {
                manager.setData(entity, "shp:dyn/grab_id", entity.getData("fiskheroes:grab_id"));
                manager.setData(entity, "shp:dyn/float_reset", entity.getData("shp:dyn/float_reset") + 0.1);
                if (entity.getData("shp:dyn/float_reset") > ammount - 0.2) {
                    manager.setData(entity, "shp:dyn/another_boolean_reset", true);
                }
            }
            if (entity.getData("shp:dyn/float_reset") >= ammount) {
                manager.setData(entity, "fiskheroes:grab_id", -1);
            }
        }
        var nbt = entity.getWornChestplate().nbt();
        if (entity.getData("fiskheroes:grab_id") == -1 && entity.getData("shp:dyn/float_reset") != 0) {

            manager.setData(entity, "shp:dyn/float_reset", 0);
        }
        if (entity.getData("shp:dyn/another_boolean_reset")) {
            lore(entity, entity.world().getEntityById(entity.getData("shp:dyn/grab_id")), manager);
        }
        if (!entity.getData("shp:dyn/another_boolean_reset") && nbt.hasKey("display")) {
            manager.removeTag(nbt, "display");
        }
    });
}
function suitOffProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("FALL_RESISTANCE", 12.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 2.5, 0);
    profile.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.45, 1);
    profile.addAttribute("STEP_HEIGHT", 0.5, 0);
    profile.addAttribute("IMPACT_DAMAGE", 0.5, 1);
}
function getProfile(entity) {
    return entity.getData("fiskheroes:dyn/nanite_timer") < 1 ? "SUITOFF" : (entity.getData("shp:dyn/invisible") || entity.getData("fiskheroes:beam_charging")) && entity.getData("shp:dyn/health_lose_timer") > 0 && entity.getData("shp:dyn/health_lose_timer") < 2 && !entity.as("PLAYER").isCreativeMode() ? String(entity.getData("shp:dyn/health_lose")) : null;

}

function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/nanite_timer") == 1 ? 8 : 7;
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }

    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function remove_tracker(player, manager) {
    manager.setData(player, "shp:dyn/another_boolean_reset", false);
    return true;
}

function isModifierEnabled(entity, modifier) {
    var data = (entity.getData("shp:dyn/integer") + 1);
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1 && entity.getData("fiskheroes:dyn/nanite_timer") == 1 && entity.getData("fiskheroes:shield_timer") == 0 && data == 1;
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5 && entity.getData("fiskheroes:dyn/nanite_timer") == 1);
    case "fiskheroes:equipment":
        return entity.getData("fiskheroes:dyn/nanite_timer") == 1 && data == 1;
    case "fiskheroes:invisibility":
        return entity.getData("fiskheroes:dyn/nanite_timer") == 1 && data == 2;
    case "fiskheroes:fire_immunity":
        return entity.getData("fiskheroes:dyn/nanite_timer") == 1;
    case "fiskheroes:shield":
        return entity.getData("fiskheroes:dyn/nanite_timer") == 1 && Math.round(entity.getData("shp:dyn/invisible_float")) == 0 && data == 2 && entity.getData("shp:dyn/float_interp_reset") == 1;
    case "fiskheroes:charged_beam":
        return entity.getData("fiskheroes:dyn/nanite_timer") == 1 && Math.round(entity.getData("shp:dyn/invisible_float")) == 0 && data == 2;
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var data = (entity.getData("shp:dyn/integer") + 1);
    var nbt = entity.getWornChestplate().nbt();
    if (keyBind == "NANITE_TRANSFORM") {
        return (!entity.isSneaking() || entity.getData("fiskheroes:dyn/nanite_timer") < 1) && (entity.getData("fiskheroes:dyn/nanite_timer") == 1 && !entity.isSneaking() || entity.getData("fiskheroes:dyn/nanite_timer") < 1) && entity.getHeldItem().isEmpty();
    }

    if (entity.getData("fiskheroes:dyn/nanite_timer") < 1 && keyBind != "NANITE_TRANSFORM" && keyBind != "SLOW_MOTION") {
        return false;
    }
    switch (keyBind) {
    case "UTILITY_BELT":
        return entity.getHeldItem().isEmpty() && data == 1;
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty() && data == 1;
    case "WEB_ZIP":
        return entity.getHeldItem().isEmpty() && data == 1;
    case "SLOW_MOTION":
        return entity.getData("fiskheroes:dyn/nanite_timer") < 1 ? true : data == 1;
    case "Func_INVISIBLE":
        return entity.isSneaking() && data == 2;
    case "CHARGED_BEAM":
        return !entity.isSneaking() && data == 2;
    case "TENTACLES":
        return entity.isSneaking() && entity.getData("fiskheroes:tentacles") == null;
    case "TENTACLE_GRAB":
        return !entity.isSneaking() && data == 2;
    case "Func_REMOVE_TRACKER":
        return entity.isSneaking() && data == 2;
    case "AIM":
        return entity.getHeldItem().isEmpty() && data == 2;
    case "SHIELD":
        return entity.getHeldItem().isEmpty() && data == 2 && entity.getData("shp:dyn/float_interp_reset") == 1;
    case "SHIELD_CHARGE":
        return entity.getHeldItem().isEmpty() && data == 2 && (!entity.getData("shp:dyn/boolean_reset") && entity.getData("shp:dyn/float_interp_reset") == 0 || entity.getData("shp:dyn/boolean_reset") && entity.getData("shp:dyn/float_interp_reset") >= 0);
    default:
        return entity.isSneaking() && keyBind == ("Func_CYCLE" + String(data)) ? true : !keyBind.startsWith("Func_CYCLE");
    }
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return entity.getData("fiskheroes:dyn/nanite_timer") == 1;
    case "BREATHE_SPACE":
        return !entity.getData("fiskheroes:mask_open") && entity.getData("fiskheroes:dyn/nanites");
    default:
        return false;
    }
}

function toggleInvisible(player, manager) {
    manager.setData(player, "shp:dyn/invisible", !player.getData("shp:dyn/invisible"));
    return true;
}

function keybind_cycle(player, manager) {
    manager.setData(player, "shp:dyn/boolean", true);
    return true;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:shield_timer") == 0 && Math.round(entity.getData("shp:dyn/invisible_float")) == 0;
}

//obsucate this suit before releasing pack before releasing pack
