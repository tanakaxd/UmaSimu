class Taiki extends Uma{
    constructor(id, x, y,abilities) {
            
        super(id, x, y,abilities);
        this.abilities.push(new AbilityTaiki(false));
	}
}