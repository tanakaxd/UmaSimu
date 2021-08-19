class Taiki extends Uma{
    constructor(id, x, y) {
            
        super(id, x, y);
        this.abilities.push(new AbilityTaiki(false));
        this.abilities.push(new AbilityOguri(true));
        this.abilities.push(new AbilityOguri(true));
        
	}
}