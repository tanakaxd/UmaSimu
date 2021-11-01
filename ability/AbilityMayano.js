class AbilityMayano extends Ability{
    constructor(inherited,delay) {
        super();
        this.inherited = inherited;
        this.base_duration = this.inherited? 5*0.6 : 5;
        this.base_acc_diff = this.inherited? 0.1 : 0.3;
        this.base_vel_diff = this.inherited? 0.05 : 0.25;
        this.modified_duration_frame = this.base_duration * (race_distance / 1000) * actual_frame_rate;

        //発動位置
        this.activated_position = delay ?? 110;

    }



    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (uma.progression == PROGRESSION.FINAL_CORNER && uma.pos.x>=this.activated_position) {
            uma.acc.x += this.base_acc_diff / actual_frame_rate / actual_frame_rate;
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
                uma.acc.x -= this.base_acc_diff / actual_frame_rate / actual_frame_rate;
                uma.dest_vel -= this.base_vel_diff / actual_frame_rate;
                this.is_active = false;
                this.is_done = true;
            }
        }
        
    }
}