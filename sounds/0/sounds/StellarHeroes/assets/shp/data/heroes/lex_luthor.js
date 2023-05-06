function init(hero) {
    hero.setName("Lex Luthor");
    hero.setTier(3);

    hero.setChestplate("Body Armor");
    hero.setLeggings("Leg Armor");
    hero.setBoots("Boot Armor");
    hero.setHelmet("Bald Head");

    hero.addPowers("shp:lexcorp_suit");

    hero.addAttribute("FALL_RESISTANCE", 2, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 2.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);

    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Orbital Laser", 4);
    hero.addKeyBind("CALL_SUIT", "Call Mech", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    //hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);
    hero.supplyFunction("canAim", canAim);
    
    hero.setDefaultScale((entity => {
        return entity.getData("shp:dyn/lexmech_timer") > 0 ? 2.0 : 1.0;
    }));
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function getTierOverride(entity) {
    return entity.getData("shp:dyn/lexmech") ? 8 : 3;
}

function isModifierEnabled(entity, modifier) {
    var data1 = entity.getData("shp:dyn/lexmech");
    switch (modifier.name()) {
        case "fiskheroes:repulsor_blast":
            return entity.getData("fiskheroes:aimed_timer") >= 1;
        case "fiskheroes:metal_skin":
            return !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:shield") && !(entity.isSprinting() && entity.getData("fiskheroes:flying")) && data1;
        case "fiskheroes:water_breathing":
            return data1;
        case "fiskheroes:controlled_flight":
            return data1;
        default:
            return true;
    }
}

//  if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("shp:dyn/lexmech") || modifier.name() == "fiskheroes:controlled_flight" && entity.getData("shp:dyn/lexmech_timer") < 1)) {
function isKeyBindEnabled(entity, keyBind) {
    return keyBind == "AIM" ? !entity.getData("shp:dyn/lexmech") : true;
}