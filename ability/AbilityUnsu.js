class AbilityUnsu extends Ability{
    constructor(inherited) {
        super();
        this.inherited = inherited;
        this.base_duration = this.inherited? 4*0.6 : 4;
        this.base_acc_diff = this.inherited? 0.2 : 0.4;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;

    }



    activate(uma) {
        if (this.is_done||this.is_active) return;
        if (course.is_spurt_corner(uma.pos.x)) {
            uma.acc.x += this.base_acc_diff / actual_frame_rate / actual_frame_rate;
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
                this.is_active = false;
                this.is_done = true;
            }
        }
        
    }
}