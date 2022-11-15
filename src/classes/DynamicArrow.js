import {Arrow} from "konva/lib/shapes/Arrow";



class DynamicArrow extends Arrow{

    _direction
    constructor(config) {
        super(config);
        this._direction = config.direction;
    }
    _sceneFunc(ctx) {
        super._sceneFunc(ctx);
;
        ctx.beginPath();

        ctx.closePath();
        ctx.fillStrokeShape(this);
    }
    get direction() {
        return this._direction;
    }

    set direction(value) {
        this._direction = value;
    }
}

export default DynamicArrow;