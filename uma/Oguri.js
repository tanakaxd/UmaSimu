class Oguri extends Uma{
    constructor(id, x, y,abilities) {
            
        super(id, x, y,abilities);
        this.abilities.push(new AbilityOguri(false));
        // this.abilities.push(new AbilityTaiki(true));
        // this.abilities.push(new AbilityTaiki(true));
        
	}
}