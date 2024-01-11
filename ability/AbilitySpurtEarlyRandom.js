class AbilitySpurtEarlyRandom extends Ability{
    constructor(duration,acc) {
        super();
        this.base_duration = duration;
        this.base_acc_diff = acc;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;

        //発動位置
        this.activated_position = course.first_spurt_early_random();

    }



    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (uma.phase == PHASE.FINAL_FIRST&&uma.pos.x>=this.activated_position) {
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

    init() {
        super.init();
        this.activated_position = course.first_spurt_early_random();
    }

    record(uma) {
        record_x.push(this.activated_position);
    }
}