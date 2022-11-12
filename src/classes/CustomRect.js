
import {Rect} from "konva/lib/shapes/Rect";
import {_registerNode} from "konva/lib/Global";
import Konva from "konva";

class CustomRect extends Rect{
    #top;
    #bottom;
    #left;
    #right;
    pointers;
    constructor(config) {
        super(config);
        this.#top = null;
        this.#bottom = null;
        this.#right = null;
        this.#left = null;
        this.pointers = new Konva.Group({
            x: this.x(),
            y: this.y(),
            rotation: 0
        });
    }
    _sceneFunc(context) {
        this.fill('transparent');
        super._sceneFunc(context);
        context.beginPath();
        this.fill('black');
        context.arc(this.width()/2, 0, 5, 0, 2 * Math.PI, false);
        context.closePath();
        context.fillStrokeShape(this);
    }
}
Rect.prototype.className = 'CustomRect';
_registerNode(CustomRect);
export default CustomRect;