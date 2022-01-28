class AbilityMonk extends Ability{
    constructor(inherited,delay) {
        super();
        this.inherited = inherited;
        this.base_duration = this.inherited? 4*0.6 : 4;
        this.base_acc_diff = this.inherited? 0.2 : 0.4;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;

        //発動位置。引数が与えられなかった場合は最終コーナーランダム発動
        this.activated_position = delay === undefined ? course.final_corner_random() : delay+course.accum_dist_to_final_corner;
    }



    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (uma.progression == PROGRESSION.FINAL_CORNER && uma.pos.x>=this.activated_position) {
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
        this.activated_position = course.final_corner_random();
    }

    record(uma) {
        record_x.push(this.activated_position);
    }
}