function tick_handler_invisible(entity, manager, invis_tick_rate, invis_transparent, invis_timer_tick_rate) {
    var invis_float = entity.getData("shp:dyn/invisible_float");
    var invis_float_test = entity.getData("shp:dyn/invisible_float_test");
    /*
    var invis_tick_rate = 0.05; // default:0.05
    var invis_transparent = 0.8; // default:0.8
     var cape_tick_rate = 0.05; // default:0.05
     */
    manager.setData(entity, "shp:dyn/invisible_opacity", false)

    if (entity.motion().length() > 0.08 || !entity.isOnGround()) {
        manager.setData(entity, "shp:dyn/invisible_opacity", true)
    }
    if (entity.getData("shp:dyn/invisible")) {
        if (entity.getData("shp:dyn/invisible_timer") < 1) {
            manager.setData(entity, "shp:dyn/invisible_timer", entity.getData("shp:dyn/invisible_timer") + invis_timer_tick_rate)
        }
        if (!entity.getData("fiskheroes:invisible")) {
            if (invis_float < 1 && !entity.getData("shp:dyn/invisible_opacity")) {
                manager.setData(entity, "shp:dyn/invisible_float", invis_float + invis_tick_rate)
                manager.setData(entity, "shp:dyn/invisible_float_test", entity.getData("shp:dyn/invisible_float"))
            }

            if (invis_float >= 1) {
                manager.setData(entity, "fiskheroes:invisible", true)
                manager.setData(entity, "fiskheroes:disguise", "");
            }
        }

        if (entity.getData("shp:dyn/invisible_opacity")) {
            if (invis_float > invis_transparent && invis_float_test > invis_transparent) {
                manager.setData(entity, "shp:dyn/invisible_float", invis_float - invis_tick_rate)
            }
            if (invis_float < invis_transparent && invis_float_test < invis_transparent) {
                manager.setData(entity, "shp:dyn/invisible_float", invis_float + invis_tick_rate)
            }
            manager.setData(entity, "fiskheroes:invisible", false)
            manager.setData(entity, "fiskheroes:disguise", " ");
        }

    }

    if (!entity.getData("shp:dyn/invisible")) {
        if (entity.getData("shp:dyn/invisible_timer") > 0) {
            manager.setData(entity, "shp:dyn/invisible_timer", entity.getData("shp:dyn/invisible_timer") - invis_timer_tick_rate)
        }
        if (invis_float_test != 0) {
            manager.setData(entity, "shp:dyn/invisible_float_test", 0)
            manager.setData(entity, "fiskheroes:disguise", "");
        }
        if (invis_float > 0) {
            manager.setData(entity, "shp:dyn/invisible_float", invis_float - invis_tick_rate)
            manager.setData(entity, "fiskheroes:disguise", "");
        }
        if (entity.getData("fiskheroes:invisible")) {
            manager.setData(entity, "fiskheroes:invisible", false)
            manager.setData(entity, "fiskheroes:disguise", "");

        }

    }
}

function reset_invisible(entity, manager) {
    manager.setData(entity, "shp:dyn/invisible", false)
    manager.setData(entity, "shp:dyn/invisible_float", 0)
    manager.setData(entity, "shp:dyn/invisible_timer", 0)
    manager.setData(entity, "fiskheroes:disguise", "");
}

/*
put this for keybind - 

hero.addKeyBindFunc("Func_INVISIBLE", toggleInvisible, "key.invisibility", 5);

put this for the keybind function above - 
function toggleInvisible(player, manager) {
    manager.setData(player, "shp:dyn/invisible", !player.getData("shp:dyn/invisible"))
    return true;
}

put this for the render effect code -
utils.setOpacityWithData(renderer, 0, 1.0, "shp:dyn/invisible_float");

put this for the render code(this is for the effect code above but not in function effect outside of it) -
var utils = implement("fiskheroes:external/utils");
*/

function log(string) {
    Java.type("java.lang.System").out.println(string);
}
