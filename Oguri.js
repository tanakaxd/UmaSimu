class Oguri extends Uma{
    constructor(id, x, y) {
            
        super(id, x, y);
        this.abilities.push(new AbilityOguri(false));
        this.abilities.push(new AbilityTaiki(true));
        this.abilities.push(new AbilityTaiki(true));
        
	}
}