class AbilityHidariMawari extends Ability{
    constructor(isDouble) {
        super();
        this.isDouble = isDouble;
        this.base_duration = -1;
        this.base_vel_diff = this.isDouble? 0.082:0.055;
        this.modified_duration_frame = this.base_duration * (race_distance / 1000) * actual_frame_rate;

    }



    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (uma.phase == PHASE.FINAL_FIRST) {
            uma.dest_vel += this.base_vel_diff / actual_frame_rate;
            this.is_active = true;
        }
    }

    renew(uma) {
        if (this.is_active) this.lapse++;
        
    }

    terminate(uma) {

        // if (this.is_active) {
        //     if (this.modified_duration_frame < this.lapse) {
        //         uma.dest_vel -= this.base_vel_diff / actual_frame_rate;
        //         this.is_active = false;
        //         this.is_done = true;
        //     }
        // }
    }

}