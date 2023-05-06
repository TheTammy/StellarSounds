function init(hero) {
    hero.setName("Venom");
    hero.setTier(7);
    hero.hide();

    hero.setChestplate("Symbiote");
    hero.addAttribute("FALL_RESISTANCE", 16.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 4, 0);
    hero.addAttribute("PUNCH_DAMAGE", 10.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);
    hero.addAttribute("BASE_SPEED", 0.3, 1);
    hero.addAttribute("STEP_HEIGHT", 1, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.7, 1);

}
