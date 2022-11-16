import {Arrow} from "konva/lib/shapes/Arrow";
import ArrowLine from "@/classes/ArrowLine";

const DEFAULT_DRAG_MODE = 'move';
const STRETCH_DRAG_MODE = 'stretch';
class DynamicArrow extends Arrow{
    _direction
    #to;
    #dragmode;
    constructor(config) {
        super(config);
        this.#to = config.to ?? null;
        this.#dragmode = DEFAULT_DRAG_MODE;
        this._direction = config.direction;
        this.on('dragstart', this._onDragStart);
        this.on('dragmove', this._onDragMove);
        this.on('dragend', this._onDragEnd);
    }

    _sceneFunc(ctx) {
        super._sceneFunc(ctx);
        ctx.beginPath();

        ctx.closePath();
        ctx.fillStrokeShape(this);
    }
    indexInParent(){
        return this.parent.children.indexOf(this);
    }
    length(){
        return Math.sqrt((this.points()[0] - this.points()[2])**2+(this.points()[1]-this.points()[3])**2);
    }
    notify(){
        if (this.parent.children[this.indexInParent()+1])
            this.parent.children[this.indexInParent()+1].update();
        if (this.parent.children[this.indexInParent()-1])
            this.parent.children[this.indexInParent()-1].update();
    }
    update(){
        console.log(this.indexInParent() + 'получил уведомление');
        if (this.parent.children[this.indexInParent()-1]){
            this.points()[0] = this.parent.children[this.indexInParent()-1].attrs.points[2] + this.parent.children[this.indexInParent()-1].x() - this.x();
            this.points()[1] = this.parent.children[this.indexInParent()-1].attrs.points[3] + this.parent.children[this.indexInParent()-1].y() - this.y();
        }
        if (this.parent.children[this.indexInParent()+1]){
            this.points()[2] = this.parent.children[this.indexInParent()+1].attrs.points[0] + this.parent.children[this.indexInParent()+1].x() - this.x();
            this.points()[3] = this.parent.children[this.indexInParent()+1].attrs.points[1] + this.parent.children[this.indexInParent()+1].y() - this.y();
        }
        if (Math.abs(this.points()[0] - this.points()[2]) < this.length() && Math.abs(this.points()[1] - this.points()[3]) < this.length()) {
            this.breakline();
        }

    }
    breakline(){
        let newLine = new ArrowLine({
            x: 0,
            y: 0,
            strokeWidth: this.strokeWidth(),
            fill: this.fill(),
            stroke: this.stroke(),
            draggable: this.draggable(),
            points: [],
            direction: this.direction == 'row' ? 'column' : 'row',
        });
        if (this.direction == 'row'){
            if (this.points()[1] > this.points()[3]){
                newLine.points()[2] = this.points()[0];
                newLine.points()[3] = this.points()[1];
                newLine.points()[0] = this.points()[0]
                newLine.points()[1] = this.points()[3];
                this.points()[1] = this.points()[3];
                this.parent.children.splice(this.indexInParent(),0, newLine);
            }
            else if(this.points()[1] < this.points()[3]){
                newLine.points()[0] = this.points()[2];
                newLine.points()[1] = this.points()[1];
                newLine.points()[2] = this.points()[2];
                newLine.points()[3] = this.points()[3];
                this.points()[3] = this.points()[1];
                this.parent.children.splice(this.indexInParent()+1,0, newLine);

            }
        }
        else{
            if (this.points()[0] > this.points()[2]){
                newLine.points()[2] = this.points()[0];
                newLine.points()[3] = this.points()[1];
                newLine.points()[0] = this.points()[3];
                newLine.points()[1] = this.points()[1];
                this.points()[0] = this.points()[2];
                this.parent.children.splice(this.indexInParent(),0, newLine);

            }
            else if(this.points()[0] < this.points()[2]){
                newLine.points()[0] = this.points()[0];
                newLine.points()[1] = this.points()[3];
                newLine.points()[2] = this.points()[2];
                newLine.points()[3] = this.points()[3];
                this.points()[2] = this.points()[0];
                this.parent.children.splice(this.indexInParent()+1,0, newLine);
            }

        }
    }
    _onDragStart(e){
        if ((e.evt.x - this.attrs.points[2])**2 + (e.evt.y - this.attrs.points[3])**2 < 5)
            this.#dragmode = STRETCH_DRAG_MODE;
    }
    _onDragMove(e){
        if (this.direction == 'row'){
            this.x(0);
        }
        if (this.direction == 'column'){
            this.y(0)
        }
        if (this.#dragmode == STRETCH_DRAG_MODE){
            this.points()[2] = e.evt.x;
            this.points()[3] = e.evt.y;
        }
    }

    _onDragEnd(){
        this.notify();
        const group = this.parent;
        const children = group.children;
        group.removeChildren();
        group.add(...children);
    }
    get direction() {
        return this._direction;
    }

    set direction(value) {
        this._direction = value;
    }
}

export default DynamicArrow;