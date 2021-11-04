class Mac extends Uma{
    constructor(id, x, y,abilities) {
        super(id, x, y,abilities);
        this.abilities.push(new AbilityMac(false));
	}
}