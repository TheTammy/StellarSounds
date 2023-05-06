function Equipment(player, manager) {
    var nbt = player.getWornChestplate().nbt();
    var equip = manager.newTagList("[{Index: 0b, Item: {Count: 1b, Damage: 0s, id: 4097s,tag: {HeroType: shp:dying_symbiote}}}]");
    manager.setTagList(nbt, "Equipment", equip);
}

var stage2 = 80;
var stage3 = 80;
var end = 20;
var max_scare = 2;
var min_scare_timer_stage2 = 15;
var max_scare_timer_stage2 = 25;
var min_scare_timer_stage3 = 35;
var max_scare_timer_stage3 = 45;
var scare_reset_stage2 = -30;
var scare_reset_stage3 = -45;

//https://mapmaking.fr/tick/
function init(hero) {
    hero.setName("Spider-Man");
    hero.setVersion("Spectacular");
    hero.setTier(7);

    hero.setHelmet("Mask");
    hero.setChestplate("Chest");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("fiskheroes:spider_physiology", "fiskheroes:web_shooters", "fiskheroes:web_wings", "shp:symbiotic_bond");
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);

    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotionHold", 4);
    hero.addKeyBind("TRANSFORM", "Symbiote", 5);

    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:shp:dying_symbiote}", false, item => item.nbt().getString("HeroType") == "shp:dying_symbiote");

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornChestplate().nbt();
        var data1 = entity.getData("shp:dyn/symbiosis_timer");
        var data2 = entity.getData("shp:dyn/symbiosis_stages");
        var data3 = entity.getData("shp:dyn/symbiosis_stage_2_timer");
        var data4 = entity.getData("shp:dyn/symbiosis_stage_3_timer");
        var data5 = entity.getData("shp:dyn/symbiote_dying");
        var data6 = entity.getData("shp:dyn/scare_timer");
        var data7 = entity.getData("shp:dyn/scare_choose");

        if (data1 > 0) {
            if (data2 <= (stage2 + stage3 + end)) {
                manager.setData(entity, "shp:dyn/symbiosis_stages", data2 + 1);
            }
            if (data2 >= stage2 && data3 < stage2) {
                manager.setData(entity, "shp:dyn/symbiosis_stage_2_timer", data3 + 1);
            }
            if (data2 >= (stage2 + stage3) && data4 < stage3 && data3 >= stage2) {
                manager.setData(entity, "shp:dyn/symbiosis_stage_3_timer", data4 + 1);
            }
            if (data2 >= (stage2 + stage3 + end) && data5 < end && data3 >= stage2 && data4 >= stage3) {
                manager.setData(entity, "shp:dyn/symbiote_dying", data5 + 1);
            }
            if (data5 >= end && !nbt.hasKey("Equipment")) {
                Equipment(entity, manager);
                manager.setData(entity, "shp:dyn/symbiosis", false);
            }
        }
        if (data1 == 0) {
            if (entity.getData("shp:dyn/scare_in_use") != 0) {
                manager.setData(entity, "shp:dyn/scare_in_use", 0);
            }
            if (data2 > 0) {
                manager.setData(entity, "shp:dyn/symbiosis_stages", data2 - 1);
            }
            if (data2 < stage2 && data3 > 0) {
                manager.setData(entity, "shp:dyn/symbiosis_stage_2_timer", data3 - 1);
            }
            if (data2 < (stage2 + stage3) && data4 > 0) {
                manager.setData(entity, "shp:dyn/symbiosis_stage_3_timer", data4 - 1);
            }
            if (data2 < (stage2 + stage3 + end) && data3 > 0) {
                manager.setData(entity, "shp:dyn/symbiote_dying", data5 - 1);
            }
            if (nbt.hasKey("Equipment") && nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag").getInteger("Upgrades") == 1) {
                manager.removeTag(nbt, "Equipment");
            }

        }
        //detransform if burning
        var block = entity.world().getBlock(entity.pos().add(0, 0, 0));
        if ((block == "minecraft:fire" || block == "minecraft:lava" || entity.isBurning()) && entity.getData("shp:dyn/symbiosis") && entity.getData("shp:dyn/symbiosis_stage_3_timer") > 0) {
            manager.setData(entity, "shp:dyn/symbiosis", false);
        }
        // scare system
        var getRandomInt = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        if (data1 > 0 && data3 > 0) {
            if (data7 == 0) {
                if (data3 > 0 && data4 == 0) {
                    manager.setData(entity, "shp:dyn/scare_choose", getRandomInt(1, max_scare * 10));
                    Java.type("java.lang.System").out.println("scare_choose 1>> " + entity.getData("shp:dyn/scare_choose"));
                }
                if (data3 > 0 && data4 > 0) {
                    manager.setData(entity, "shp:dyn/scare_choose", getRandomInt(1, max_scare * 5));
                    Java.type("java.lang.System").out.println("scare_choose 2>> " + entity.getData("shp:dyn/scare_choose"));
                }
            }
            if (data6 < 0) {
                if (data6 > -2 && data3 > 0) {
                    if (data4 == 0) {
                        if (data7 >= 0 && data7 < 15) {
                            manager.setData(entity, "shp:dyn/scare_in_use", 1);
                            Java.type("java.lang.System").out.println("scare_in_use >> " + entity.getData("shp:dyn/scare_in_use"));
                        }
                        if (data7 >= 15 && data7 <= 20) {
                            manager.setData(entity, "shp:dyn/scare_in_use", 2);
                            Java.type("java.lang.System").out.println("scare_in_use >> " + entity.getData("shp:dyn/scare_in_use"));
                        }
                    }
                    if (data4 > 0) {
                        if (data7 >= 0 && data7 < 5) {
                            manager.setData(entity, "shp:dyn/scare_in_use", 1);
                            Java.type("java.lang.System").out.println("scare_in_use >> " + entity.getData("shp:dyn/scare_in_use"));
                        }
                        if (data7 >= 5 && data7 <= 10) {
                            manager.setData(entity, "shp:dyn/scare_in_use", 2);
                            Java.type("java.lang.System").out.println("scare_in_use >> " + entity.getData("shp:dyn/scare_in_use"));
                        }
                    }
                }
                if (data6 < (data3 > 0 && data4 == 0 ? scare_reset_stage2 : data3 > 0 && data4 > 0 ? scare_reset_stage3 : -4)) {
                    manager.setData(entity, "shp:dyn/scare_in_use", 0);
                    manager.setData(entity, "shp:dyn/scare_choose", 0);
                    manager.setData(entity, "shp:dyn/scare_timer", getRandomInt((data3 > 0 && data4 == 0 ? min_scare_timer_stage2 : min_scare_timer_stage3), (data3 > 0 && data4 == 0 ? max_scare_timer_stage2 : max_scare_timer_stage3)));
                    Java.type("java.lang.System").out.println("reset >> true");
                }

            }
            manager.setData(entity, "shp:dyn/scare_timer", entity.getData("shp:dyn/scare_timer") - 1);
        }

        if (entity.getData("shp:dyn/scare_in_use") == 1 && !entity.getData("shp:dyn/health_flicker_used") && !entity.getData("shp:dyn/health_flicker")) {
            manager.setData(entity, "shp:dyn/health_flicker", true);
            manager.setData(entity, "shp:dyn/health_flicker_used", true);
            Java.type("java.lang.System").out.println("scare health flicker >>" + entity.getData("shp:dyn/scare_in_use"));
        } else if (entity.getData("shp:dyn/scare_in_use") != 1 && entity.getData("shp:dyn/health_flicker_used") && !entity.getData("shp:dyn/health_flicker")) {
            manager.setData(entity, "shp:dyn/health_flicker_used", false);
        }
        // health flicker
        if (entity.getData("shp:dyn/health_flicker")) {
            manager.setData(entity, "fiskheroes:shield", true);
            manager.setData(entity, "fiskheroes:shield_blocking", true);

            if (entity.getData("shp:dyn/health_flicker_cooldown") == 0) {
                manager.setData(entity, "shp:dyn/health_flicker_health", Math.round(entity.getHealth()));
            }
            if (entity.getData("shp:dyn/health_flicker_cooldown") == 1) {
                manager.setData(entity, "shp:dyn/health_flicker", false);
                manager.setData(entity, "shp:dyn/health_flicker_regen", true);
            }
        }

    });

    hero.setAttributeProfile(entity => {
        if (entity.getData("shp:dyn/health_flicker")) {
            return "HEALTH_FLICKER";
        } else if (entity.getData("shp:dyn/health_flicker_regen")) {
            return String(entity.getData("shp:dyn/health_flicker_health"));
        } else if (entity.getData("shp:dyn/symbiosis_timer") > 0) {
            if (entity.getData("shp:dyn/symbiosis_stage_3_timer") > 0) {
                return "STAGE3";
            } else if (entity.getData("shp:dyn/symbiosis_stage_2_timer") > 0) {
                return "STAGE2";
            }
            return "STAGE1";

        }
        return null;
    });
    hero.addAttributeProfile("STAGE1", profile => {
        profile.inheritDefaults();
        profile.addAttribute("FALL_RESISTANCE", 13.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 2.8, 0);
        profile.addAttribute("PUNCH_DAMAGE", 8.8, 0);
        profile.addAttribute("SPRINT_SPEED", 0.65, 1);
    });
    hero.addAttributeProfile("STAGE2", profile => {
        profile.inheritDefaults();
        profile.addAttribute("FALL_RESISTANCE", 14, 0);
        profile.addAttribute("JUMP_HEIGHT", 3, 0);
        profile.addAttribute("PUNCH_DAMAGE", 9, 0);
        profile.addAttribute("SPRINT_SPEED", 0.85, 1);
    });
    hero.addAttributeProfile("STAGE3", profile => {
        profile.inheritDefaults();
        profile.addAttribute("FALL_RESISTANCE", 15, 0);
        profile.addAttribute("JUMP_HEIGHT", 3.2, 0);
        profile.addAttribute("PUNCH_DAMAGE", 9.2, 0);
        profile.addAttribute("SPRINT_SPEED", 1.05, 1);
    });

    hero.addAttributeProfile("HEALTH_FLICKER", profile => {
        profile.inheritDefaults();
        profile.addAttribute("MAX_HEALTH", -19, 0);
        profile.addAttribute("FALL_RESISTANCE", 1, 1);
    });

    for (var i = 19, o = 1; i > 0; i-- && o++) {
        hero.addAttributeProfile(String(i), profile => {
            profile.inheritDefaults();
            profile.addAttribute("MAX_HEALTH", -o, 0);
        });
    }

    hero.setHasProperty(hasProperty);
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:gliding", false);
    }

    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function webWingsKey(player, manager) {
    if (player.isOnGround() || player.isInWater()) {
        return false;
    }

    var flag = player.getData("fiskheroes:gliding");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:web_swinging", false);
    }

    manager.setDataWithNotify(player, "fiskheroes:gliding", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.id().startsWith("health_flicker") && modifier.name() != "fiskheroes:cooldown") {
        if (modifier.name() != "fiskheroes:healing_factor") {
            return entity.getData("shp:dyn/health_flicker");
        } else if (modifier.name() == "fiskheroes:healing_factor") {
            return entity.getData("shp:dyn/health_flicker_regen");
        }
    }
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("fiskheroes:gliding");
    case "fiskheroes:web_zip":
        return !entity.getData("fiskheroes:gliding");
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    case "fiskheroes:gliding":
        return !entity.getData("fiskheroes:web_swinging") && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.as("PLAYER").isUsingItem();
    case "fiskheroes:damage_weakness":
        if (entity.getData("shp:dyn/symbiosis_timer") > 0) {
            if (entity.getData("shp:dyn/symbiosis_stage_3_timer") > 0) {
                return modifier.id() == "sound3" || modifier.id() == "fire3";
            } else if (entity.getData("shp:dyn/symbiosis_stage_2_timer") > 0) {
                return modifier.id() == "sound2" || modifier.id() == "fire2";
            } else {
                return modifier.id() == "sound1" || modifier.id() == "fire1";
            }
        }
        return false;
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();
    switch (keyBind) {
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
    case "func_WEB_WINGS":
        return !entity.isOnGround() && !entity.isInWater() && !entity.as("PLAYER").isUsingItem();
    case "WEB_ZIP":
        return !entity.getData("fiskheroes:gliding");
    case "TRANSFORM":
        return entity.getData("shp:dyn/symbiosis_stage_3_timer") == 0 && !nbt.hasKey("Equipment");
    case "TEST":
        return !entity.getData("shp:dyn/health_flicker");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" && entity.getData("shp:dyn/health_flicker");
}
