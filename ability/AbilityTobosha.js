class AbilityTobosha extends Ability{
    constructor(isRare,delay) {
        super();
        this.isRare = isRare;
        this.base_duration = this.isRare? 3 : 3;
        this.base_acc_diff = this.isRare? 0.4 : 0.2;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;

        console.log("AbilityTobosha constructor: delay="+delay);
        //発動位置
        this.activated_position = delay === undefined ? course.final_corner_random() : delay;

        this.skill_point = this.isRare ? 360 : 180;

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