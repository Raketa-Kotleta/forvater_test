import {Arrow} from "konva/lib/shapes/Arrow";
import ArrowLine from "@/classes/ArrowLine";

const DEFAULT_DRAG_MODE = 'move';
const STRETCH_DRAG_MODE = 'stretch';
class DynamicArrow extends Arrow{
    #dragmode;
    _direction
    constructor(config) {
        super(config);
        this._direction = config.direction;
        this.#dragmode = DEFAULT_DRAG_MODE;
        this.on('dragstart', this._onDragStart);
        this.on('dragmove', this._onDragMove);
        this.on('dragend', this._onDragEnd);
    }
    indexInParent(){
        return this.parent.children.indexOf(this);
    }
    _sceneFunc(ctx) {
        super._sceneFunc(ctx);
        ctx.beginPath();

        ctx.closePath();
        ctx.fillStrokeShape(this);
    }
    update(){
        this.parent.children[this.indexInParent()-1].attrs.points[2] = this.points()[2];
        this.points()[0] = this.parent.children[this.indexInParent()-1].attrs.points[2];

    }
    _onDragStart(e){
        let group = this.parent;
        let children = group.children;
        let index = this.indexInParent();
        let config = {
            x: 0,
            y: 0,
            strokeWidth: this.strokeWidth(),
            fill: this.fill(),
            id: "123",
            stroke: this.stroke(),
            draggable: this.draggable(),

        }
        console.log(e);
        if (Math.sqrt((e.evt.x-(this.points()[2]+this.x()))**2 + (e.evt.y - (this.points()[3]+this.y()))**2)<20) {
            this.#dragmode = STRETCH_DRAG_MODE;
            config.points = [this.points()[0],this.points()[1],this.points()[2],this.points()[3]]
            children.splice(children.indexOf(this)-1,0, new ArrowLine({
                ...config,
                direction: this.direction == 'row' ? 'row' : 'column',
            }));

        }
        else {
            // console.log(this.direction);
            config.direction = this.direction == 'row' ? 'column' : 'row';
            const newChild = new ArrowLine({
                ...config,
            });
            if (children[index + 1]) {
                if (children[index + 1].direction == this.direction) {
                    let target = group.children.shift();
                    newChild.attrs.points = [this.attrs.points[2], this.attrs.points[3], children[index].attrs.points[0], children[index].attrs.points[1]];
                    children.unshift(newChild);
                    children.unshift(target);
                }

            }
            if (children[index - 1]) {
                if (children[index - 1].direction == this.direction) {
                    newChild.attrs.points = [children[index - 1].attrs.points[2], children[index - 1].attrs.points[3], this.attrs.points[0], this.attrs.points[1]];
                    children.splice(index, 0, newChild);
                    console.log(newChild);
                }
            }
        }
    }
    _onDragMove(e){
        if (this.direction == 'row'){
            this.x(0);
        }
        if (this.direction == 'column'){
            this.y(0)
        }
        if (this.#dragmode == DEFAULT_DRAG_MODE){
            let group = this.parent;
            let index = group.children.indexOf(this);
            if (group.children[index + 1]){
                group.children[index+1].attrs.points[0] = group.children.at(index).attrs.points[2] + group.children[index].x() -  group.children[index+1].x();
                group.children[index+1].attrs.points[1] = group.children.at(index).attrs.points[3] + group.children[index].y() -  group.children[index+1].y();
            }
            if (group.children[index-1]){

                group.children[index-1].attrs.points[2] = group.children[index].attrs.points[0] + group.children[index].x() -  group.children[index-1].x();
                group.children[index-1].attrs.points[3] = group.children[index].attrs.points[1] + group.children[index].y() -  group.children[index-1].y();
            }
        }
        else{
            this.x(0);
            this.y(0);
            this.points()[2] = e.evt.x;
            this.points()[3]= e.evt.y;
            this.update();
        }
    }

    _onDragEnd(){
            const group = this.parent;
            const children = group.children;
            group.removeChildren();
            group.add(...children);
        this.#dragmode = DEFAULT_DRAG_MODE;
    }
    get direction() {
        return this._direction;
    }

    set direction(value) {
        this._direction = value;
    }
}

export default DynamicArrow;