import {Line} from "konva/lib/shapes/Line";
// const DEFAULT_DRAG_MODE = 'move';
// const STRETCH_DRAG_MODE = 'stretch';
class ArrowLine extends Line{
    #ARC_RADIUS = 2;
    direction;
    #dragmode;
    constructor(config) {
        super(config)
        config.draggable = true;
        this.direction = config.direction;
        this.#dragmode =
        this.on('dragstart', this._onDragStart);
        this.on('dragmove', this._onDragMove);
        this.on('dragend', this._onDragEnd);
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
    _onDragStart(e){
        let group = this.parent;
        let children = group.children;
        let index = children.indexOf(this);
        console.log(e);
        let config = {
            x: 0,
            y: 0,
            strokeWidth: this.strokeWidth(),
            fill: this.fill(),
            stroke: this.stroke(),
            draggable: this.draggable(),
            direction: this.direction == 'row' ? 'column' : 'row',
        }
        if (children[index + 1]) {
            if (children[index + 1].direction == this.direction) {
                let target = group.children.shift();
                group.children.unshift(new ArrowLine({
                    ...config,
                    points: [this.attrs.points[2], this.attrs.points[3], children[index].attrs.points[0], children[index].attrs.points[1]],
                }));
                group.children.unshift(target);
            }

        }
        if (children[index - 1]) {
            if (children[index - 1].direction == this.direction) {
                //let left_half = children.slice(0,index)
                console.log('hello');
            }
        }

    }
    _onDragMove(){
        if (this.direction == 'row'){
            this.x(0);
        }
        if (this.direction == 'column'){
            this.y(0)
        }
        let group = this.parent;
        let index = group.children.indexOf(this);
        if (group.children[index+1]){

            group.children[index+1].attrs.points[0] = group.children.at(index).attrs.points[2] + group.children[index].x() -  group.children[index+1].x();
            group.children[index+1].attrs.points[1] = group.children.at(index).attrs.points[3] + group.children[index].y() -  group.children[index+1].y();
        }
        if (group.children[index-1]){
            group.children[index-1].attrs.points[2] = group.children[index].attrs.points[0] + group.children[index].x() - group.children[index-1].x();
            group.children[index-1].attrs.points[3] = group.children[index].attrs.points[1] + group.children[index].y() - group.children[index-1].y();
        }
    }

    _onDragEnd(){
        const group = this.parent;
        const children = group.children;
        group.removeChildren();
        group.add(...children);
    }
}
export default ArrowLine;