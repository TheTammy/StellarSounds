var DC = Java.type('com.fiskmods.heroes.common.DimensionalCoords');
function extractCoords(input) {
    var sections = input.split(" ");
    if (sections.length === 3) { // Make sure input is formatted correctly
        var x = parseInt(sections[0], 10);
        var y = parseInt(sections[1], 10);
        var z = parseInt(sections[2], 10);
        return {
            x: x,
            y: y,
            z: z,
            isValid: () => {
                return !isNaN(x) && !isNaN(y) && !isNaN(z);
            }
        };
    }
    return {
        isValid: () => false
    };
}

function extractDest(entity) {
    return extractCoords(String(entity.getData("fiskheroes:disguise")));
}

function canUseTeleport(entity) {
    if (entity.getData("fiskheroes:disguise") == entity.getName()) {
        return false;
    }
    return extractDest(entity).isValid();
}
function dashing(entity, str) {
    if (entity.getData("fiskheroes:teleport_timer") == 0) {
        str = String(str.trim().toLowerCase());
        if (str == "check") {
            return (entity.getData("shp:dyn/1float_reset") > 0 && entity.getData("shp:dyn/1float_reset") < 1 && entity.isSprinting()) &&
            (entity.getData("shp:dyn/3boolean_reset") && !entity.isOnGround() && entity.motionY() > 0 || entity.isOnGround() || entity.getData("fiskheroes:flying"));
        }
        if (str == "flight_allow") {
            return entity.isSprinting() && !entity.isOnGround() && (entity.motionY() < -0.08 || entity.getData("fiskheroes:flying") && entity.motionY() < 0.2) &&
            entity.getData("shp:dyn/1float_reset") < 1;
        }
    }
    return false;
}

function init(hero) {
    hero.setName("Nightcrawler");
    hero.setTier(5);

    hero.setHelmet("Head");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    hero.setBoots("Feet");

    hero.addPowers("shp:brimstone");

    hero.addAttribute("FALL_RESISTANCE", 1, 1);
    hero.addAttribute("JUMP_HEIGHT", 4, 0);
    hero.addAttribute("PUNCH_DAMAGE", 3, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    hero.addAttribute("BASE_SPEED", 0.2, 1);

    hero.addKeyBind("TELEPORT", "BAMF!", 1);
    hero.addKeyBind("SHAPE_SHIFT", "Travel Between Dimensions (X,Y,Z)", 2);

    hero.addKeyBindFunc("Func_TELEPORT", functionTeleport, "Teleport", 5);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    //hero.setHasProperty(hasProperty);
    hero.setTickHandler((entity, manager) => {
        var clamp = (value, min, max) => {
            return Math.min(Math.max(value, min), max);
        };

        // dash
        if (entity.getData("shp:dyn/1float_reset") == 0 && !entity.getData("shp:dyn/1boolean_reset")) {
            manager.setData(entity, "shp:dyn/1boolean_reset", true);
        } else if (entity.getData("shp:dyn/1float_reset") == 1 && entity.getData("shp:dyn/1boolean_reset") && !entity.isSprinting()) {
            manager.setData(entity, "shp:dyn/1boolean_reset", false);
        }
        if (!entity.isOnGround() && entity.motionY() > 0 && entity.isSprinting() && !entity.getData("shp:dyn/2boolean_reset")) {
            manager.setData(entity, "shp:dyn/1float_reset", 0);
            manager.setData(entity, "shp:dyn/2boolean_reset", true);
        } else if (entity.isOnGround() && entity.getData("shp:dyn/2boolean_reset")) {
            manager.setData(entity, "shp:dyn/2boolean_reset", false);
        }

        if (!entity.getData("shp:dyn/3boolean_reset") && entity.isOnGround() && entity.isSprinting()) {
            manager.setData(entity, "shp:dyn/3boolean_reset", true);
        } else if (entity.getData("shp:dyn/3boolean_reset") && entity.isOnGround() && !entity.isSprinting()) {
            manager.setData(entity, "shp:dyn/3boolean_reset", false);
        }

        if (entity.motionY() < -0.08 && entity.isSprinting() && !entity.getData("shp:dyn/2boolean_reset") && entity.getHeldItem().isEmpty()) {
            manager.setData(entity, "fiskheroes:flying", true);
            manager.setData(entity, "shp:dyn/2boolean_reset", true);
        }

        if (dashing(entity, "check") && entity.getHeldItem().isEmpty()) {
            manager.setData(entity, "fiskheroes:shield", true);
            manager.setData(entity, "fiskheroes:shield_blocking", true);
        } else if (!dashing(entity, "check") && (entity.getData("fiskheroes:shield") || entity.getData("fiskheroes:shield_blocking"))) {
            manager.setData(entity, "fiskheroes:shield", false);
            manager.setData(entity, "fiskheroes:shield_blocking", false);
        }

        // sword hand
        var data1 = (entity.getData("fiskheroes:energy_projection_timer") == 0 && (Math.abs(entity.motionX()) == 0 || Math.abs(entity.motionX()) == 0) && entity.getWornChestplate().nbt().getTagList("Equipment").tagCount() == 1);
        var data2 = entity.getData("shp:dyn/1float_interp_reset");

        if (!data1 && data2 > 0) {
            manager.setData(entity, "shp:dyn/1float_interp_reset", clamp(data2 - 0.2, 0, 1))
        }
        if (data1 && data2 < 1) {
            manager.setData(entity, "shp:dyn/1float_interp_reset", clamp(data2 + 0.2, 0, 1))
        }

        // air jump
        var data1 = entity.getData("shp:dyn/2float_interp_reset");
        if (entity.getData("fiskheroes:jetpacking_timer") > 0) {
            manager.setData(entity, "shp:dyn/5boolean_reset", true);
            manager.setData(entity, "shp:dyn/4boolean_reset", true);
        } else if (entity.getData("shp:dyn/4boolean_reset") && entity.isOnGround()) {
            manager.setData(entity, "shp:dyn/4boolean_reset", false);
        }

        if (entity.getData("shp:dyn/5boolean_reset")) {
            manager.setData(entity, "shp:dyn/2float_interp_reset", clamp(data1 + 0.05, 0, 1))
            if (data1 == 1 || entity.isOnGround()) {
                manager.setData(entity, "shp:dyn/5boolean_reset", false)
            }
        }
        if (!entity.getData("shp:dyn/5boolean_reset") && data1 != 0) {
            manager.setData(entity, "shp:dyn/2float_interp_reset", 0)
        }

    });
    
    for (var i = 2000,o = 19; o > 0; (i=i-100) && (o == 19? o-- : o = o - 2)) {
        hero.addAttributeProfile(String(i), profile => {
            profile.inheritDefaults();
            profile.addAttribute("MAX_HEALTH", -o, 0);
        });
    }
    hero.addAttributeProfile("DASH", profile => {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 5, 1);
    });
    hero.addAttributeProfile("SPRINT", profile => {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 0.5, 1);
    });

    hero.setAttributeProfile(entity => {
        if (entity.getData("fiskheroes:teleport_timer") > 0) {
            for (var i = 2000; i > 1000; (i=i-100)) {
                if (Math.ceil(entity.getData("shp:dyn/3float_reset")) >= i) {
                    return String(i);
                } 
            }
        } else {
            if (dashing(entity, "check")) {
                return "DASH";
            }
            if (entity.getData("shp:dyn/1float_reset") == 1 && entity.isSprinting()) {
                return "SPRINT";
            }
        }
        return null;
    });

    hero.setModifierEnabled(isModifierEnabled);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:leaping":
        return !entity.getData("fiskheroes:flying") && entity.getData("shp:dyn/3boolean_reset") && entity.getData("fiskheroes:teleport_timer") == 0;
    case "fiskheroes:controlled_flight":
        return dashing(entity, "flight_allow");
    case "fiskheroes:propelled_flight":
        return entity.motionY() < -0.4 && !entity.getData("shp:dyn/4boolean_reset") && !entity.getData("shp:dyn/2boolean_reset") && !entity.isSprinting();
    case "fiskheroes:flight":
        return entity.getData("shp:dyn/4boolean_reset") && entity.getData("shp:dyn/2float_reset") < 1 && (entity.motionY() > 0 || entity.getData("shp:dyn/2float_reset") < 0.3);
    default:
        return true;
    }
}

function functionTeleport(player, manager) {
    var dest = extractDest(player);
    var dim = player.world().getDimension();
    manager.setData(player, "fiskheroes:teleport_dest", new DC(dest.x, dest.y + 1, dest.z, dim));
    manager.setData(player, "fiskheroes:teleport_delay", 1);
    manager.setDataWithNotify(player, "fiskheroes:shape_shifting_to", null);
    manager.setDataWithNotify(player, "fiskheroes:shape_shift_timer", 1);
    Java.type("java.lang.System").out.println(String(Math.ceil(player.pos().distanceTo(dest.x, dest.y + 1, dest.z))));
    manager.setData(player, "shp:dyn/3float_reset", player.pos().distanceTo(dest.x, dest.y + 1, dest.z))
    return true;
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "Func_TELEPORT":
        return extractDest(entity).isValid();
    case "SHAPE_SHIFT_RESET":
        return extractDest(entity).isValid();
    case "SHAPE_SHIFT_RESET":
        return extractDest(entity).isValid();
    default:
        return true;
    }
}
