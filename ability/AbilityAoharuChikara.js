class AbilityAoharuChikara extends Ability{
    constructor(isRare) {
        super();
        this.isRare = isRare;
        this.base_duration = this.isRare? 3:3;
        this.base_acc_diff = this.isRare? 0.4:0.2;
        this.modified_duration_frame = this.base_duration * (race_distance / 1000) * actual_frame_rate;

        //発動位置
        const scope = accum_dist_till_second_spurt - accum_dist_till_first_spurt;
        this.activated_position = Math.random()*scope + accum_dist_till_first_spurt;//108-441
        // this.activated_position = 274;

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
}