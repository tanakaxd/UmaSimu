class AbilityCorner extends Ability{
    constructor(isDouble) {
        super();
        this.isDouble = isDouble;
        this.base_duration = this.isDouble? 3:3;
        this.base_vel_diff = this.isDouble? 0.25:0.15;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;
        this.activated_position = course.corner_random();

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
        this.activated_position = course.corner_random();
    }

    record(uma) {
        record_x.push(this.activated_position);
    }
}