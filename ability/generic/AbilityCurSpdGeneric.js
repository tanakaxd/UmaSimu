class AbilityCurSpdGeneric extends Ability{
    constructor(duration,spd,pos,sp) {
        super();
        this.base_duration = duration;
        this.base_vel_diff = spd;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;

        //発動位置
        //引数が数値ならそのまま入れて、関数なら関数を毎度実行する。呼び出し先がsetupなので一度しか実行されない。確率検証するなら都度実行が必要
        //一度別クラスの関数を保存するとこちらで実行する時にthisがこのインスタンスを指すようになってうまく機能しない
        this.is_pos_random = typeof pos !== "number";
        if(this.is_pos_random){//関数の保存
            this.func_activated_position = pos;
        }
        this.activated_position = this.is_pos_random? this.func_activated_position() : pos;
        this.skill_point = sp;


    }

    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (uma.pos.x>=this.activated_position) {
            uma.vel.x += this.base_vel_diff / actual_frame_rate;
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
        if(this.is_pos_random){
            this.activated_position = this.func_activated_position();
        }
    }

    record(uma) {
        record_x.push(this.activated_position);
    }
}