var DC = Java.type("com.fiskmods.heroes.common.DimensionalCoords");
var putting_on_suit = 4;
var builds = ["BUILD_BLADE", "BUILD_SMACK_HANDS", "BUILD_SLAM_CANNON", "BUILD_PUNK_BUSTERS", "BUILD_REX_RIDE", "BUILD_BLAST_CASTER", "BUILD_FUN_CHUNKS", "BUILD_BAD_AXES", "BUILD_BLOCK_PARTY", "BUILD_SKY_SLYDER"]
function init(hero) {
    hero.setName("Generator Rex");
    hero.setTier(7);

    hero.setHelmet("Goggles");
    hero.setChestplate("Jacket");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("shp:omega_1_nanites");

    hero.addAttribute("FALL_RESISTANCE", 1, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);

    hero.addKeyBind("BUILD_BLADE", "Build Big Fat Sword", 2);
    hero.addKeyBind("BUILD_SMACK_HANDS", "Build Smack Hands", 2);
    hero.addKeyBind("BUILD_SLAM_CANNON", "Build Slam Canon", 2);
    hero.addKeyBind("BUILD_PUNK_BUSTERS", "Build Punk Busters", 2);
    hero.addKeyBind("BUILD_REX_RIDE", "Build Rex Ride", 2);
    hero.addKeyBind("BUILD_BLAST_CASTER", "Build Blast Caster", 2);
    hero.addKeyBind("BUILD_FUN_CHUNKS", "Build Fun Chunks", 2);
    hero.addKeyBind("BUILD_BAD_AXES", "Build Bad Axes", 2);
    hero.addKeyBind("BUILD_BLOCK_PARTY", "Build Block Party", 2);
    hero.addKeyBind("BUILD_SKY_SLYDER", "Build Sky Slyder", 2);

    hero.addKeyBind("CHARGE_ICE", "Cure", 5);
    hero.addKeyBind("TELEKINESIS", "Tech Tamper", 5);
    hero.addKeyBind("AIM", "Tech Tamper", 5);

    hero.addKeyBind("GRAVITY_MANIPULATION", "Cycle Builds", 1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canDischargeEnergy", false);

    hero.setAttributeProfile(getAttributeProfile);
    hero.addAttributeProfile("JUMP", profile => {
        profile.inheritDefaults();
        profile.addAttribute("JUMP_HEIGHT", 15, 0);
    });
    hero.addAttributeProfile("BLADE", profile => {
        profile.inheritDefaults();
        profile.addAttribute("PUNCH_DAMAGE", 10, 0);
    });
    hero.addAttributeProfile("SMACK_HANDS", profile => {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 0.18, 1);
        profile.addAttribute("PUNCH_DAMAGE", 15, 0);
    });
    hero.setDamageProfile(entity => entity.getData("fiskheroes:cryo_charge") == 1 ? "PUNCH" : null);
    hero.addDamageProfile("PUNCH", {
        "types": {
            "BLUNT": 0.5,
            "ELECTRICITY": 0.5
        },
        "properties": {
            "EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 50,
                    "amplifier": 1,
                    "chance": 1.0,

                    "id": "fiskheroes:eternium",
                    "duration": 40,
                    "amplifier": 1,
                    "chance": 1.0
                }
            ]
        }

    });

    hero.supplyFunction("canAim", canAim);

    hero.setTickHandler((entity, manager) => {
        // above y 2000 then toggle beetween moon
        if (entity.posY() > 2000) {
            manager.setData(entity, "fiskheroes:teleport_dest", new DC(entity.posX(), entity.posY(), entity.posZ(), entity.world().getDimension() + 1));
            manager.setData(entity, "fiskheroes:teleport_delay", 1);
        }
        //  gen rex timer set true or false(damage timer)
        if (entity.getData("shp:dyn/gen_rex_timer") == 1 && !entity.getData("shp:dyn/gen_rex")) {
            manager.setData(entity, "shp:dyn/gen_rex", true);
        }
        if (entity.getData("shp:dyn/gen_rex_timer") <= 0.75 && entity.getData("shp:dyn/gen_rex")) {
            manager.setData(entity, "shp:dyn/gen_rex", false);
        }
        if (entity.getData("shp:dyn/gen_rex_timer_second") < putting_on_suit) {
            manager.setData(entity, "shp:dyn/gen_rex_timer_second", entity.getData("shp:dyn/gen_rex_timer_second") + 0.1);
        }

        // forced sentry

        if (entity.getData("shp:dyn/forced_sentry_timer") == 1 && !entity.getData("shp:dyn/forced_sentry")) {
            manager.setData(entity, "shp:dyn/forced_sentry", true);
        }
        if (entity.getData("shp:dyn/forced_sentry_timer") == 0 && entity.getData("shp:dyn/forced_sentry")) {
            manager.setData(entity, "shp:dyn/forced_sentry", false);
        }

        if (entity.getData("fiskheroes:grab_id") > -1) {
            var entityGrabbed = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));

            if (entityGrabbed.getData("fiskheroes:suit_open") == false && entityGrabbed.is("PLAYER")) {
                manager.setData(entityGrabbed, "fiskheroes:suit_open", true);

            }
            if (entityGrabbed.getData("fiskheroes:dyn/nanites") == true && entityGrabbed.is("PLAYER")) {
                manager.setData(entityGrabbed, "fiskheroes:dyn/nanites", false);

            }

            if (entityGrabbed.is("PLAYER") == false) {
                manager.setData(entity, "fiskheroes:grab_id", -1);
            }

            if (entity.getData("shp:dyn/forced_sentry")) {
                manager.setData(entity, "fiskheroes:grab_id", -1);
            }

        }

        // charged jump

        if ((!entity.isSneaking() && entity.getData("shp:dyn/charged_jump_timer") < 0.90
                 || !entity.isOnGround() || entity.motionX() > 0 || entity.motionZ() > 0 || !entity.getData("shp:dyn/gex_rex_charged_jump")) && entity.getData("shp:dyn/charged_jump")) {
            manager.setData(entity, "shp:dyn/charged_jump", false);
        }
        if (entity.getData("shp:dyn/charged_jump_timer") == 0 && entity.isSneaking() && entity.isOnGround() && entity.motionX() == 0 && entity.motionZ() == 0
             && !entity.getData("shp:dyn/charged_jump") && entity.getData("shp:dyn/gex_rex_charged_jump")) {
            manager.setData(entity, "shp:dyn/charged_jump", true);
        }

        // visuals
        if (entity.getData("shp:dyn/charged_jump_timer") > 0.8 && !entity.getData("shp:dyn/charged_jump_visual") &&
            entity.world().getBlock(entity.pos().add(0, -1, 0)) == "minecraft:air" && entity.world().getBlock(entity.pos().add(0, -2, 0)) == "minecraft:air" && entity.getData("shp:dyn/gex_rex_charged_jump")) {
            manager.setData(entity, "shp:dyn/charged_jump_visual", true);
        }
        if ((entity.world().getBlock(entity.pos().add(0, -1, 0)) != "minecraft:air" || entity.world().getBlock(entity.pos().add(0, -2, 0)) != "minecraft:air" || entity.getData("fiskheroes:flying") || !entity.getData("shp:dyn/gex_rex_charged_jump"))
             && entity.getData("shp:dyn/charged_jump_visual")) {
            manager.setData(entity, "shp:dyn/charged_jump_visual", false);
        }
        if (entity.getData("shp:dyn/charged_jump_visual") && entity.getData("shp:dyn/charged_jump_visual_timer") < 1) {
            manager.setData(entity, "shp:dyn/charged_jump_visual_timer", entity.getData("shp:dyn/charged_jump_visual_timer") + 0.1);
        }

        if (!entity.getData("shp:dyn/charged_jump_visual") && entity.getData("shp:dyn/charged_jump_visual_timer") > 0.5) {
            manager.setData(entity, "shp:dyn/charged_jump_visual_timer", entity.getData("shp:dyn/charged_jump_visual_timer") - 0.5);
        }

        // goggles
        if (!entity.getData("fiskheroes:flying") && !entity.getData("fiskheroes:speeding") && entity.getData("shp:dyn/gen_rex_goggles") < 0.3) {
            manager.setData(entity, "shp:dyn/gen_rex_goggles", entity.getData("shp:dyn/gen_rex_goggles") + 0.1);
        }

        if ((entity.getData("fiskheroes:flying") || entity.getData("fiskheroes:speeding")) && entity.getData("shp:dyn/gen_rex_goggles") > 0.1) {
            manager.setData(entity, "shp:dyn/gen_rex_goggles", entity.getData("shp:dyn/gen_rex_goggles") - 0.1);
        }

        // cylcer
        var slot = entity.getData("shp:dyn/gen_rex_keybind_cycler");
        var data = entity.getData("fiskheroes:gravity_amount");
        if (data != 0) {
            manager.setData(entity, "shp:dyn/gen_rex_keybind_cycler", data > 0 ? slot == 9 ? 0 : slot + 1 : slot == 0 ? 9 : slot - 1);
            manager.setData(entity, "fiskheroes:gravity_amount", 0);
        }
        // turn off
        var data = entity.getData("shp:dyn/gen_rex_keybind_cycler");
        if (data != 0 && entity.getData("shp:dyn/gex_rex_blade")) {
            manager.setData(entity, "shp:dyn/gex_rex_blade", false);
        } else if (data != 1 && entity.getData("shp:dyn/gex_rex_smack_hands")) {
            manager.setData(entity, "shp:dyn/gex_rex_smack_hands", false);
        } else if (data != 2 && entity.getData("shp:dyn/gex_rex_slam_cannon")) {
            manager.setData(entity, "shp:dyn/gex_rex_slam_cannon", false);
        } else if (data != 3 && entity.getData("shp:dyn/gex_rex_charged_jump")) {
            manager.setData(entity, "shp:dyn/gex_rex_charged_jump", false);
            /*
        } else if (data != 4 && entity.getData("shp:dyn/")) {
            manager.setData(entity, "shp:dyn/", false);*/
        } else if (data != 5 && entity.getData("shp:dyn/gex_rex_blast_caster")) {
            manager.setData(entity, "shp:dyn/gex_rex_blast_caster", false);
        } else if (data != 6 && entity.getData("shp:dyn/gex_rex_fun_chunks")) {
            manager.setData(entity, "shp:dyn/gex_rex_fun_chunks", false);
        } else if (data != 7 && entity.getData("shp:dyn/gex_rex_bad_axes")) {
            manager.setData(entity, "shp:dyn/gex_rex_bad_axes", false);
        } else if (data != 8 && entity.getData("shp:dyn/gex_rex_block_party")) {
            manager.setData(entity, "shp:dyn/gex_rex_block_party", false);
        } else if (data != 9 && entity.getData("shp:dyn/gex_rex_sky_slyder")) {
            manager.setData(entity, "shp:dyn/gex_rex_sky_slyder", false);
        }

    });
}


function getAttributeProfile(entity) {
    if (entity.getData("shp:dyn/charged_jump_timer") > 0.90 && entity.getData("shp:dyn/gex_rex_charged_jump")) {
        return "JUMP";
    }
    if (entity.getData("shp:dyn/gex_rex_blade")) {
        return "BLADE";
    }
    if (entity.getData("shp:dyn/gex_rex_smack_hands") == 1) {
        return "SMACK_HANDS";
    }
    return null;

}

function isModifierEnabled(entity, modifier) {
    if (entity.getData("shp:dyn/gen_rex") && modifier.name() != "fiskheroes:cooldown") {
        return false;
    }
    if (modifier.name() == "fiskheroes:cooldown") {
        switch (modifier.id()) {
        case "Damaged":
            return entity.getData("fiskheroes:time_since_damaged") < 32 && entity.getData("shp:dyn/gen_rex_timer_second") > putting_on_suit;
        case "Hungry":
            return entity.getData("fiskheroes:time_since_damaged") > 32 && entity.as("PLAYER").getFoodLevel() < 10;
        case "NotHungry":
            return entity.getData("fiskheroes:time_since_damaged") > 32 && entity.as("PLAYER").getFoodLevel() > 10;
        }

    }
    switch (modifier.name()) {
    case "fiskheroes:cryo_charge":
        return !entity.isPunching() && !entity.getData("shp:dyn/forced_sentry");
    default:
        return true;
    }
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ICE":
        return entity.getData("fiskheroes:cryo_charge") == 1 ? !entity.isSneaking() : true;
    case "TELEKINESIS":
        return entity.isSneaking() && (entity.getData("fiskheroes:cryo_charge") == 1 ? true : false);
    case "AIM":
        return entity.isSneaking() && (entity.getData("fiskheroes:cryo_charge") == 1 ? true : false);
    default:
        return keyBind.startsWith("BUILD_") ? keyBind == builds[entity.getData("shp:dyn/gen_rex_keybind_cycler")] : true;
    }
}

function canAim(entity) {
    return entity.getData("fiskheroes:grab_id") > -1;
}

function nothing() {
    return true;
}
