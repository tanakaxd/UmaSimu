class Mayano extends Uma{
    constructor(id, x, y,abilities,delay) {
        super(id, x, y,abilities);
        this.abilities.push(new AbilityMayano(false,delay));
	}
}