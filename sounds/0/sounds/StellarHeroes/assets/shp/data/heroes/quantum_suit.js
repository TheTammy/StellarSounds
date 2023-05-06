var DC = Java.type('com.fiskmods.heroes.common.DimensionalCoords');
var mask_transformation_speed = 0.2;
var System = Java.type("java.lang.System");
function SafeY(entity) {
    var complete = false;
    for (var i = 0; complete == false; i++) {
        if (entity.world().getBlock(entity.pos().add(0, i + 3, 0)) == "minecraft:air" &&
            entity.world().getBlock(entity.pos().add(0, i + 4, 0)) == "minecraft:air") {
            complete = true;
            return entity.posY() + i + 4;
        }

    }
}

function init(hero) {
    hero.setName("Quantum Realm Suit/Nanotech");
    hero.setTier(2);

    hero.setChestplate("Band");

    hero.addPowers("shp:qr_suit");
    hero.addAttribute("PUNCH_DAMAGE", 2, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 2.5, 0);

    hero.addKeyBind("ACTIVATE", "Activate Suit", 1);
    hero.addKeyBindFunc("func_QR", QRKey, "Instant QR Travel", 2);
    hero.addKeyBindFunc("func_TELEPORT", leaveQRKey, "Leave The Quantum Realm", 3);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setRuleValueModifier(ruleModifier);

    hero.setTickHandler((entity, manager) => {
        if (entity.getData("shp:dyn/teleport")) {
            if (entity.world().getDimension() == 2595) {
                manager.setData(entity, "fiskheroes:teleport_dest", new DC(Math.floor(entity.posX()), Math.floor(entity.posY()), Math.floor(entity.posZ()), 0));
                manager.setData(entity, "fiskheroes:teleport_delay", 1);
            }
            if (entity.world().getDimension() == 0) {
                manager.setData(entity, "fiskheroes:teleport_dest", new DC(Math.floor(entity.posX()), SafeY(entity), Math.floor(entity.posZ()), 0));
                manager.setData(entity, "fiskheroes:teleport_delay", 1);
                manager.setData(entity, "shp:dyn/teleport", false);
            }
        }
        // mask transformation
        var suit_timer_two = entity.getData("shp:dyn/suit_timer_two");
        if (entity.getData("shp:dyn/suit")) {
            if (suit_timer_two < 1.0) {
                manager.setData(entity, "shp:dyn/suit_timer_two", suit_timer_two + mask_transformation_speed);
            }
            if (entity.getData("shp:dyn/suit_timer_two") > 1.0) {
                manager.setData(entity, "shp:dyn/suit_timer_two", 1.0);
            }
        }
        if (!entity.getData("shp:dyn/suit")) {
            if (suit_timer_two > 0.0) {
                manager.setData(entity, "shp:dyn/suit_timer_two", suit_timer_two - mask_transformation_speed);
            }
            if (entity.getData("shp:dyn/suit_timer_two") < 0.0) {
                manager.setData(entity, "shp:dyn/suit_timer_two", 0.0);
            }
        }
    });
}
function leaveQRKey(entity, manager) {
    manager.setData(entity, "fiskheroes:teleport_dest", new DC(Math.floor(entity.posX()), Math.floor(entity.posY()), Math.floor(entity.posZ()), 1));
    manager.setData(entity, "fiskheroes:teleport_delay", 1);
    manager.setData(entity, "fiskheroes:scale", 1);
    manager.setData(entity, "shp:dyn/teleport", true);
    return true;
}
function QRKey(player, manager) {
    manager.setData(player, "fiskheroes:scale", 0.0625);
    return true;
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return entity.getData("shp:dyn/suit_timer") == 1;
    case "BREATHE_SPACE":
        return !entity.getData("fiskheroes:mask_open") && entity.getData("shp:dyn/suit");
    default:
        return false;
    }
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:size_manipulation") {
        return (entity.getData("shp:dyn/suit"));
    } else if (modifier.name() == "fiskheroes:damage_immunity") {
        return (entity.getData("shp:dyn/suit"));
    } else if (modifier.name() == "fiskheroes:water_breathing") {
        return (entity.getData("shp:dyn/suit") && !entity.getData("fiskheroes:mask_open"));
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "func_QR":
        return (entity.getData("shp:dyn/suit")) && entity.world().getDimension() != 2594;
    case "func_TELEPORT":
        return (entity.getData("shp:dyn/suit")) && entity.world().getDimension() == 2594;
    default:
        return true;
    }
}

function ruleModifier(entity, rule) {
    switch (rule.name()) {
    case "fiskheroes:ticks_qrtimer":
        return 0;
    default:
        return null;
    }
}

//obsucate this suit before releasing pack
