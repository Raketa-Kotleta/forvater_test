
import {Rect} from "konva/lib/shapes/Rect";
import {_registerNode} from "konva/lib/Global";


class CustomRect extends Rect{
    #top;
    #bottom;
    #left;
    #right;
    #pointFill;
    #rectFill;
    #pointRadius;
    constructor(config) {
        super(config);
        this.#top = false;
        this.#bottom = false;
        this.#right = false;
        this.#left = false;
        this.#pointFill = config.pointFill ?? 'gray';
        this.#rectFill = config.rectFill ?? 'transparent';
        this.#pointRadius = config.pointRadius ?? 0;
    }
    _sceneFunc(context) {
        this.fill(this.#rectFill);
        super._sceneFunc(context);

        context.beginPath();
            this.fill(this.pointFill);
            if (this.top) context.arc(this.width()/2, 0, this.pointRadius, 0, 2 * Math.PI, false);
            context.moveTo(this.width(), this.height()/2);
            if (this.right) context.arc(this.width(), this.height()/2, this.pointRadius, 0, 2 * Math.PI, false);
            context.moveTo(this.width()/2, this.height());
            if (this.bottom) context.arc(this.width()/2, this.height(), this.pointRadius, 0, 2 * Math.PI, false);
            context.moveTo(0, this.height()/2);
            if (this.left) context.arc(0, this.height()/2, this.pointRadius, 0, 2 * Math.PI, false);
        context.closePath();

        context.fillStrokeShape(this);
    }
    get top() {
        return this.#top;
    }

    set top(value) {
        this.#top = value;
    }
    get left() {
        return this.#left;
    }

    set left(value) {
        this.#left = value;
    }
    get bottom() {
        return this.#bottom;
    }

    set bottom(value) {
        this.#bottom = value;
    }
    get right() {
        return this.#right;
    }

    set right(value) {
        this.#right = value;
    }
    get pointFill() {
        return this.#pointFill;
    }

    set pointFill(value) {
        this.#pointFill= value;
    }
    get rectFill() {
        return this.#rectFill;
    }

    set rectFill(value) {
        this.#rectFill = value;
    }
    get pointRadius() {
        return this.#pointRadius;
    }

    set pointRadius(value) {
        if (value < 0)
            value = 0;
        this.#pointRadius = value;
    }
}
Rect.prototype.className = 'CustomRect';
_registerNode(CustomRect);
export default CustomRect;