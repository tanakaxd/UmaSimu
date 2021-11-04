class AbilitySpeedStar extends Ability{
    constructor(isRare,delay) {
        super();
        this.isRare = isRare;
        this.base_duration = this.isRare? 1.2:1.2;
        this.base_vel_diff = this.isRare? 0.35:0.15;
        this.modified_duration_frame = this.base_duration * (race_distance / 1000) * actual_frame_rate;

        console.log("AbilitySppedStar constructor: delay="+delay);

        this.activated_position = delay === undefined ? final_corner_random() : delay;
    }



    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (uma.progression == PROGRESSION.FINAL_CORNER && uma.pos.x>=this.activated_position) {
            uma.dest_vel += this.base_vel_diff / actual_frame_rate;
            this.is_active = true;
        }
    }

    renew(uma) {
        if (this.is_active) this.lapse++;
        
    }

    terminate(uma) {

        if (this.is_active) {
            if (this.modified_duration_frame < this.lapse) {
                uma.dest_vel -= this.base_vel_diff / actual_frame_rate;
                this.is_active = false;
                this.is_done = true;
            }
        }
    }

    init() {
        super.init();
        this.activated_position = final_corner_random();
    }
}