class AbilityTozanka extends Ability{
    constructor(isRare) {
        super();
        this.isRare = isRare;
        this.base_duration = this.isRare? 3 : 3;
        this.base_acc_diff = this.isRare? 0.4 : 0.2;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;

        //発動位置
        this.activated_position = course.get_first_uphill();

    }



    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (uma.pos.x>=this.activated_position) {
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