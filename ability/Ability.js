class Ability{
    
    constructor() {
        //とりあえず一回しか発動しない前提
        this.inherited = false;
        this.isRare = false;
        this.skill_point = 0;//TODO とりあえず0で初期化。上位スキルは下位スキルの分も含める
        this.base_duration;
        this.modified_duration_frame;
        this.activated_position;
        this.lapse = 0;
        this.is_active = false;
        this.is_done = false;
    }

    update(uma) {
        this.activate(uma);
        this.renew();
        this.terminate(uma);
    }
    activate(uma) {

        
    }

    renew(uma) {
        
    }

    terminate(uma) {
        
    }

    init() {
        this.lapse = 0;
        this.is_active = false;
        this.is_done = false;
    }

    record(uma) {
        // record_x.push(this.activated_position);
    }
}