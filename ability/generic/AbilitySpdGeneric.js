class AbilitySpdGeneric extends Ability{
    constructor(duration,spd,pos) {
        super();
        this.base_duration = duration;
        this.base_vel_diff = spd;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;

        //発動位置
        this.activated_position = pos;

    }

    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (uma.pos.x>=this.activated_position) {
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
    }

    record(uma) {
        record_x.push(this.activated_position);
    }
}