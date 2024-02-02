class AbilityKage extends Ability{
    constructor(isRare) {
        super();
        this.isRare = isRare;
        this.base_duration = this.isRare? 0.9 : 0.9;
        this.base_acc_diff = this.isRare? 0.4 : 0.2;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;

        this.skill_point = this.isRare ? 360 : 180;


    }



    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (course.is_final_first(uma.pos.x)) {//ウマのフィールドを比較しても書けるが、ストレートやコーナー情報を後に実装する予定ならコースクラスに聞いておいたほうがベター
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