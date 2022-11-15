import {Line} from "konva/lib/shapes/Line";
class ArrowLine extends Line{
    #ARC_RADIUS = 2;
    direction;
    constructor(config) {
        super(config)
        config.draggable = true;
        this.direction = config.direction;
        this.on('dragmove', this.onDragMove);

    }
    _sceneFunc(context) {
        super._sceneFunc(context);
        context.beginPath();
            context.arc(
                (this.points()[0]+this.points()[2])/2,
                (this.points()[1]+this.points()[3])/2,
                this.#ARC_RADIUS,
                0,
                2 * Math.PI,
                false
            );
        context.closePath();
        context.fillStrokeShape(this);
    }

    onDragMove(){
        if (this.direction == 'row'){
            this.x(0);
        }
        if (this.direction == 'column'){
            this.y(0)
        }

    }
}
export default ArrowLine;