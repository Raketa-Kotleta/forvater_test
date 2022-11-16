import {Arrow} from "konva/lib/shapes/Arrow";
import ArrowLine from "@/classes/ArrowLine";

const DEFAULT_DRAG_MODE = 'move';
const STRETCH_DRAG_MODE = 'stretch';
class DynamicArrow extends Arrow{
    _direction;
    _connection;
    _dragmode;
    constructor(config) {
        super(config);
        this._dragmode = DEFAULT_DRAG_MODE;
        this._direction = config.direction;
        this._connection = config.connection ?? null;
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
    notify(objects, callback){
        objects.forEach(o=>{
            if (o)
                callback(o);
        })
    }
    update(){
        if (this.parent.children[this.indexInParent()-1]){
            this.points()[0] = this.parent.children[this.indexInParent()-1].attrs.points[2] + this.parent.children[this.indexInParent()-1].x() - this.x();
            this.points()[1] = this.parent.children[this.indexInParent()-1].attrs.points[3] + this.parent.children[this.indexInParent()-1].y() - this.y();
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
            direction: this.direction,
        });
        if (Math.abs(this.points()[0] - this.points()[2]) < this.length() && Math.abs(this.points()[1] - this.points()[3]) < this.length()) {
            if (this.direction == 'row'){
                this.points()[0] = this.points()[2];
                this.direction = 'column';
            }
            else{
                this.points()[1] = this.points()[3];
                this.direction = 'row';
            }
            this.parent.children.splice(this.indexInParent(),0, newLine);
            const indexOfNewLine = this.parent.children.indexOf(newLine);
            newLine.points()[2] = this.parent.children[indexOfNewLine+1].attrs.points[0] + this.parent.children[indexOfNewLine+1].x();
            newLine.points()[3] = this.parent.children[indexOfNewLine+1].attrs.points[1] + this.parent.children[indexOfNewLine+1].y();
            newLine.points()[0] = this.parent.children[indexOfNewLine-1].attrs.points[2] + this.parent.children[indexOfNewLine-1].x();
            newLine.points()[1] = this.parent.children[indexOfNewLine-1].attrs.points[3] + this.parent.children[indexOfNewLine-1].y();
        }

    }
    _onDragStart(e){
        if (Math.sqrt((e.evt.x - (this.points()[2] + this.x()))**2 + (e.evt.y - (this.points()[3]+this.y()))**2) < 10)
            this.dragmode = STRETCH_DRAG_MODE;
    }
    _onDragMove(e){
        if (this.direction == 'row'){
            this.x(0);
        }
        if (this.direction == 'column'){
            this.y(0);
        }
        if (this.dragmode == STRETCH_DRAG_MODE){
            this.x(0);
            this.y(0);
            this.points()[2] = e.evt.x;
            this.points()[3] = e.evt.y;
            this.update();
        }
    }
    _onDragEnd(){
        if (this.dragmode == STRETCH_DRAG_MODE)
            this.breakline();
        else
            this.notify(
                [this.parent.children[this.indexInParent()-1], this.parent.children[this.indexInParent()+1]],
                (it)=>{
                    it.update();
                    it.breakline();
                }
            );
        const group = this.parent;
        const children = group.children;
        group.removeChildren();
        group.add(...children);
        group.children.filter(it=>it.length() == 0).forEach(it=>it.destroy());
        this.dragmode = DEFAULT_DRAG_MODE;
    }
    get direction() {
        return this._direction;
    }

    set direction(value) {
        this._direction = value;
    }
    get dragmode() {
        return this._dragmode;
    }

    set dragmode(value) {
        this._dragmode = value;
    }

    get connection() {
        return this._connection;
    }

    set connection(value) {
        this._connection = value;
    }
}

export default DynamicArrow;