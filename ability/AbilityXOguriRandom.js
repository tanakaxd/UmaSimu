class AbilityXOguriRandom extends Ability{
    constructor(inherited) {
        super();
        this.inherited = inherited;
        this.base_duration = this.inherited? 5*0.6 : 5;
        this.base_acc_diff = this.inherited? 0.1 : 0.3;
        this.base_vel_diff = this.inherited? 0.05 : 0.25;
        this.modified_duration_frame = this.base_duration * (course.race_distance / 1000) * actual_frame_rate;

        this.skill_probability = 0.9;
        this.mid_heal_skills_counts = 2;
        this.mid_heal_skills_pos = [];
        this.getHealPositions();
        this.activated_position = -1;
    }



    activate(uma) {
        if (this.is_done || this.is_active) return;
        if (this.isTriggerable(uma)) {
            this.activated_position = this.mid_heal_skills_pos[2];//TODO temporal
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

    isTriggerable(uma) {
        if (this.mid_heal_skills_pos.length < 3) return false;
        return uma.pos.x >= this.mid_heal_skills_pos[2];
    }
    
    getHealPositions() {
        this.mid_heal_skills_pos.splice(0);
        if (Math.random() <= this.skill_probability)this.mid_heal_skills_pos.push(300);//コーナー回復
        for (let i = 0; i < this.mid_heal_skills_counts; i++) {
            if (Math.random() <= this.skill_probability) {
                this.mid_heal_skills_pos.push(course.mid_random());
            }
        }
        this.mid_heal_skills_pos.sort((a, b) => a - b);
    }

    init() {
        super.init();
        this.activated_position = -1;
        this.getHealPositions();
    }

    record(uma) {
        record_x.push(this.activated_position);
    }
}