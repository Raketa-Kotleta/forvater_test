
import {Rect} from "konva/lib/shapes/Rect";
import {_registerNode} from "konva/lib/Global";


class CustomRect extends Rect{
    #top;
    #bottom;
    #left;
    #right;
    #pointFill;
    #rectFill;
    constructor(config) {
        super(config);
        this.#top = null;
        this.#bottom = null;
        this.#right = null;
        this.#left = null;
        this.#pointFill = config.pointFill ?? 'gray';
        this.#rectFill = config.rectFill ?? 'transparent';
    }
    _sceneFunc(context) {
        this.fill(this.#rectFill);
        super._sceneFunc(context);

        context.beginPath();
            this.fill(this.#pointFill);
            context.arc(this.width()/2, 0, 7, 0, 2 * Math.PI, false);
        context.closePath();

        context.fillStrokeShape(this);
    }
    drawPoints(color){
        this.#pointFill = color;
    }
}
Rect.prototype.className = 'CustomRect';
_registerNode(CustomRect);
export default CustomRect;