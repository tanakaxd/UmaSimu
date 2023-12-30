class KawasakiDirt2100 extends Course{

    constructor() {
        super();

        //ある区間の長さ            
        this.race_distance = 2100;
        this.simulated_distance = this.race_distance - start_pos;//序盤は除外
        this.early_length = this.race_distance / 6;
        this.middle_length = this.race_distance / 2;
        this.spurt_length = this.race_distance/3;
        this.first_spurt_length = this.spurt_length/2;
        this.second_spurt_length = this.spurt_length / 2;
        this.third_corner_length = 100;
        this.final_corner_length = 100;
        this.last_straight_length = 300;
        this.final_corner_not_spurt_length = 0;
        this.final_corner_spurt_length = 100;
        this.third_corner_not_spurt_length = 0;
        this.third_corner_spurt_length = 100;
        this.second_half_length = this.race_distance / 2;

        //ある区間の開始地点座標。スタートは0。ゴールは1400
        this.accum_dist_to_early = 0;
        this.accum_dist_to_middle = this.early_length;
        this.accum_dist_to_first_spurt = this.early_length + this.middle_length;
        this.accum_dist_to_second_spurt = this.accum_dist_to_first_spurt + this.first_spurt_length;
        this.accum_dist_to_spurt = this.early_length + this.middle_length;
        this.accum_dist_to_third_corner = 1600;
        this.accum_dist_to_final_corner = this.accum_dist_to_third_corner + this.third_corner_length;//最終コーナー
        this.accum_dist_to_spurt_corner = 1600;//終盤コーナー
        this.accum_dist_to_last_straight = this.accum_dist_to_final_corner + this.final_corner_length;
        this.accum_dist_to_second_half = this.race_distance / 2;

        //ある地点
        this.first_uphill = -1;
        this.first_downhill = -1;

        this.standard_frame = 97213;//TODO

    }

    is_pre_third_corner(pos_x) {
        return pos_x < this.accum_dist_to_third_corner;
    }

    is_third_corner(pos_x) {
        return pos_x >= this.accum_dist_to_third_corner && pos_x < this.accum_dist_to_final_corner;
    }

    is_final_corner(pos_x) {
        return pos_x >= this.accum_dist_to_final_corner && pos_x < this.accum_dist_to_last_straight;
    }

    is_spurt_corner(pos_x) {
        return pos_x >= this.accum_dist_to_spurt_corner;//TODO　最終直線を除外する
    }

    is_last_straight(pos_x) {
        return pos_x >= this.accum_dist_to_last_straight;
    }

    is_early(pos_x) {
        return pos_x < this.accum_dist_to_middle;
    }

    is_middle(pos_x) {
        return pos_x >= this.accum_dist_to_middle && pos_x < this.accum_dist_to_first_spurt;
    }

    is_final(pos_x) {
        return pos_x >= this.accum_dist_to_first_spurt;
    }

    is_final_first(pos_x) {
        return pos_x >= this.accum_dist_to_first_spurt && pos_x < this.accum_dist_to_second_spurt;
    }

    is_final_second(pos_x) {
        return pos_x >= this.accum_dist_to_second_spurt;
    }

    
    get_phase(pos_x) {
        if (this.is_early(pos_x)) {
            return PHASE.EARLY;
        } else if (this.is_middle(pos_x)) {
            return PHASE.MIDDLE;
        } else if (this.is_final_first(pos_x)) {
            return PHASE.FINAL_FIRST;
        } else if (this.is_final_second(pos_x)){
            return PHASE.FINAL_SECOND;
        } else {
            console.error("invalid phase!!!")
        }
    }

    get_progression(pos_x) {
        if (this.is_pre_third_corner(pos_x)) {
            return PROGRESSION.PRE_THIRD_CORNER;
        } else if (this.is_third_corner(pos_x)) {
            return PROGRESSION.THIRD_CORNER;
        } else if (this.is_final_corner(pos_x)) {
            return PROGRESSION.FINAL_CORNER;
        } else if(this.is_last_straight(pos_x)){
            return PROGRESSION.LAST_STRAIGHT;
        } else {
            console.error("invalid progression!!!!")
        }
    }

    mid_random() {
        return Math.random() * this.middle_length + this.accum_dist_to_middle;
    }

    second_half_random() {
        return Math.random() * this.second_half_length + this.accum_dist_to_second_half;
    }

    final_corner_random() {
        return Math.random() * this.final_corner_length + this.accum_dist_to_final_corner;
    }

    first_spurt_random() {
        return Math.random() * this.first_spurt_length + this.accum_dist_to_first_spurt;
    }

    first_spurt_early_random(){
        return Math.random() * this.first_spurt_length / 2 + this.accum_dist_to_first_spurt;
    }

    second_spurt_random() {
        return Math.random() * this.second_spurt_length + this.accum_dist_to_second_spurt;
    }

    last_straight_random() {
        return Math.random() * this.last_straight_length + this.accum_dist_to_last_straight;
    }

    spurt_random() {
        return Math.random() * this.spurt_length + this.accum_dist_to_spurt;
    }

    get_first_uphill() {
        return this.first_uphill;
    }

    get_first_downhill() {
        return this.first_downhill;
    }    
    
}