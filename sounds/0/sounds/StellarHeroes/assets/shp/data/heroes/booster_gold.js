var DC = Java.type('com.fiskmods.heroes.common.DimensionalCoords');
var max_boost_flight = 3;

function lore(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    var lore = manager.newCompoundTag("{Lore:[" + "\u00A76X " + String(Math.floor(entity.posX())) + "," + "\u00A76Y " +
            String(Math.floor(entity.posY())) + "," + "\u00A76Z " + String(Math.floor(entity.posZ())) + "," + "\u00A76Health " + String(Math.round(entity.getHealth())) + "]}");
    manager.setCompoundTag(nbt, "display", lore);
}
function init(hero) {
    hero.setName("Booster Gold");
    hero.setTier(8);

    hero.setHelmet("Cowl");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("shp:advanced_tech");

    hero.addAttribute("FALL_RESISTANCE", 1, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("PUNCH_DAMAGE", 8, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);

    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("CHARGED_BEAM", "Energy Blasts", 2);
    hero.addKeyBind("SHIELD", "Force Field", 3);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 4);
    hero.addKeyBind("Func_SAVE", "Save Temporal Position", 5);
    hero.addKeyBind("Func_LOAD", "Load Temporal Position", 5);

    for (var i = 19, o = 1; i > 0; i-- && o++) {
        hero.addAttributeProfile(String(i), profile => {
            profile.inheritDefaults();
            profile.addAttribute("MAX_HEALTH", -o, 0);
        });
    }

    hero.setAttributeProfile(getHealthProfile);

    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);

    hero.setTickHandler((entity, manager) => {
        if (entity.posY() > 2000) {
            manager.setData(entity, "fiskheroes:teleport_dest", new DC(entity.posX(), entity.posY(), entity.posZ(), entity.world().getDimension() + 1));
            manager.setData(entity, "fiskheroes:teleport_delay", 1);
        }
        var nbt = entity.getWornChestplate().nbt();
        if (nbt.getBoolean("recall_health_change")) {
            manager.setFloat(nbt, "recall_health_change_float", nbt.getFloat("recall_health_change_float") + 0.1);
        }
        if (nbt.getFloat("recall_health_change_float") > 2.5 && nbt.getBoolean("recall_health_change")) {
            manager.setBoolean(nbt, "recall_health_change", false);
        }
        if (nbt.getBoolean("recall") && nbt.getFloat("recall_float") < 0.2) {
            manager.setFloat(nbt, "recall_float", nbt.getFloat("recall_float") + 0.1);
        }
        if (nbt.getBoolean("recall") == false && nbt.getFloat("recall_float") > 0) {
            manager.setFloat(nbt, "recall_float", nbt.getFloat("recall_float") - 0.1);
        }

        var getRandomInt = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        };

        if (entity.getData("fiskheroes:flight_boost_timer") == 0 && entity.isSprinting() && entity.getData("fiskheroes:flying")) {
            manager.setData(entity, "shp:dyn/choose_flight", getRandomInt(0, max_boost_flight));
            Java.type("java.lang.System").out.println("test");

        }
        if (entity.getData("shp:dyn/recall")) {
            if (entity.getData("shp:dyn/recall_timer") > 0.4 && entity.getData("shp:dyn/recall_timer") < 0.6 && !(nbt.getBoolean("recall"))) {
                manager.setInteger(nbt, "recall_dim", entity.world().getDimension());
                manager.setDouble(nbt, "recall_health", Math.round(entity.getHealth()));
                manager.setData(entity,"shp:dyn/1integer_reset", Math.ceil(Math.random() * 2));
                manager.setFloat(nbt, "recall_posx", entity.posX());
                manager.setFloat(nbt, "recall_posy", entity.posY());
                manager.setFloat(nbt, "recall_posz", entity.posZ());
                manager.setBoolean(nbt, "recall", true);
                lore(entity, manager);
            } else if (entity.getData("shp:dyn/recall_timer") == 1) {
                manager.setData(entity, "shp:dyn/recall", false);
            }
        }
        if (entity.getData("shp:dyn/recall_load")) {
            if (entity.getData("shp:dyn/recall_load_timer") > 0.4 && entity.getData("shp:dyn/recall_load_timer") < 0.6 && nbt.getBoolean("recall")) {
                manager.setData(entity, "fiskheroes:teleport_dest", new DC(Math.floor(nbt.getFloat("recall_posx")), Math.floor(nbt.getFloat("recall_posy")), Math.floor(nbt.getFloat("recall_posz")), entity.world().getDimension()));
                manager.setData(entity, "fiskheroes:teleport_delay", 1);
                manager.setBoolean(nbt, "recall_health_change", true);
                manager.setFloat(nbt, "recall_health_change_float", 0);
                manager.setBoolean(nbt, "recall", false);
                manager.removeTag(nbt, "display");
                manager.setData(entity, "shp:dyn/recall_cooldown", true);
            } else if (entity.getData("shp:dyn/recall_load_timer") == 1) {
                manager.setData(entity, "shp:dyn/recall_load", false);
            }
        }

    });

}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();
    switch (modifier.name()) {
    case "fiskheroes:healing_factor":
        return nbt.getBoolean("recall_health_change");
    default:
        return true;
    }
}
function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();
    switch (keyBind) {
    case "CHARGED_BEAM":
        return !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
    case "AIM":
        return !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
    case "SHIELD":
        return !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
    case "Func_LOAD":
        return nbt.getInteger("recall_dim") == entity.world().getDimension() && nbt.getFloat("recall_float") >= 0.2 && !entity.getData("fiskheroes:flying") && entity.getData("shp:dyn/recall_timer") == 0 && !entity.getData("shp:dyn/recall_cooldown");
    case "Func_SAVE":
        return nbt.getFloat("recall_float") <= 0 && !entity.getData("fiskheroes:flying") && entity.getData("shp:dyn/recall_timer") == 0 && !entity.getData("shp:dyn/recall_cooldown");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function getHealthProfile(entity) {
    var nbt = entity.getWornChestplate().nbt();
    var i = nbt.getDouble("recall_health");
    return nbt.getBoolean("recall_health_change") && i < 20 ? String(i) : null;
}

//obsucate this suit before releasing pack (maybe)
