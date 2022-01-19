class AbilityBono extends Ability{
    constructor(inherited,activated_position) {
        super();
        this.inherited = inherited;
        this.base_duration = this.inherited? 5*0.6 : 5;
        this.base_acc_diff = this.inherited? 0.1 : 0.3;
        this.base_vel_diff = this.inherited? 0.05 : 0.25;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;

        //発動位置。引数が与えられなかった場合はランダム
        this.activated_position = activated_position === undefined ? this.getRandomPos(): activated_position;//45-60%
    }



    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (uma.pos.x>=this.activated_position) {
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

    getRandomPos() {
        return getRandomPos(course.race_distance * 45 / 100, course.race_distance * 60 / 100);
    }

    init() {
        super.init();
        this.activated_position = this.getRandomPos();
    }

    record(uma) {
        record_x.push(this.activated_position);
    }

}