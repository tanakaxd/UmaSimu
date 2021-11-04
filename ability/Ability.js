class Ability{

    //とりあえず一回しか発動しない前提
    base_duration;
    modified_duration_frame;
    lapse;
    // inherited;
    is_active;
    is_done;


    constructor() {
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
}