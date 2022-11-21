import {Arrow} from "konva/lib/shapes/Arrow";
import ArrowLine from "@/classes/ArrowLine";
import {_registerNode} from "konva/lib/Global";
import Element from "@/classes/Element";
import Socket from "@/classes/Socket";

const DEFAULT_DRAG_MODE = 'move';
const STRETCH_DRAG_MODE = 'stretch';

class DynamicArrow extends Arrow{
    constructor(config) {
        super(config);
        this.attrs.dragmode = DEFAULT_DRAG_MODE;
        this.attrs.direction = config.direction;
        this.attrs.connection = config.connection ?? null;
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
        if (this.attrs.connection && this.dragmode == DEFAULT_DRAG_MODE){
            this.points()[2] = this.attrs.connection.parent.position().x - this.attrs.connection.offsetX();
            this.points()[3] = this.attrs.connection.parent.position().y - this.attrs.connection.offsetY();
        }
    }
    breakline(mode = "row"){
        let newLine = new ArrowLine({
            x: 0,
            y: 0,
            strokeWidth: this.strokeWidth(),
            fill: this.fill(),
            stroke: this.stroke(),
            draggable: this.draggable(),
            points: [],
            direction: this.direction == 'row'?'column':'row',
        });
        if (Math.abs(this.points()[0] - this.points()[2]) < this.length() && Math.abs(this.points()[1] - this.points()[3]) < this.length()) {
            if (mode == 'row'){
                this.points()[1] = this.points()[3];
                this.direction = 'row';
            }
            else if (mode == 'column'){
                this.points()[0] = this.points()[2];
                this.direction = 'column';
            }
            if (this.parent.children[this.indexInParent()-1].direction == this.direction){
                this.parent.children.splice(this.indexInParent(),0, newLine);
                const indexOfNewLine = this.parent.children.indexOf(newLine);
                newLine.points()[2] = this.parent.children[indexOfNewLine+1].attrs.points[0] + this.parent.children[indexOfNewLine+1].x();
                newLine.points()[3] = this.parent.children[indexOfNewLine+1].attrs.points[1] + this.parent.children[indexOfNewLine+1].y();
                newLine.points()[0] = this.parent.children[indexOfNewLine-1].attrs.points[2] + this.parent.children[indexOfNewLine-1].x();
                newLine.points()[1] = this.parent.children[indexOfNewLine-1].attrs.points[3] + this.parent.children[indexOfNewLine-1].y();
            }else{
                this.parent.children[this.indexInParent()-1].update();
            }

        }

    }
    _onDragStart(e){
        console.log(Math.sqrt((e.evt.x - (this.points()[2] + this.x()))**2 + (e.evt.y - (this.points()[3]+this.y()))**2));
        if (Math.sqrt((e.evt.x - (this.points()[2] + this.x()))**2 + (e.evt.y - (this.points()[3]+this.y()))**2) < 20)
            this.dragmode = STRETCH_DRAG_MODE;
    }
    _onDragMove(e){
        if (this.direction == 'row'){
            this.x(0);
        }
        if (this.direction == 'column'){
            this.y(0);
        }
        if (this.dragmode == STRETCH_DRAG_MODE || this.connection){
            this.x(0);
            this.y(0);
            this.points()[2] = e.evt.x;
            this.points()[3] = e.evt.y;
            this.update();
        }
    }
    _onDragEnd(){
        if (this.dragmode == STRETCH_DRAG_MODE || this.connection) {
            this.breakline('row');
            const socket = this.findMatches();
            if (this.connection){
               if (!socket)
                   this.disconnect();
            }
            if (socket){
                this.connect(socket)
            }
        }
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
    connect(socket){
        this.attrs.connection = socket;
        this.notify([socket], it=>it.connect(this));
    }
    disconnect(){
        this.notify([this.connection],it=>{it.disconnect(this)})
        this.connection = null;
    }
    findMatches(){
        let socket = null
        let elements = this.getLayer().children.filter(it => it instanceof Element);
        for (let element of elements){
            element.children.forEach(it => {
                if (Math.sqrt((it.parent.position().x - it.offsetX() - this.points()[2])**2 + (it.parent.position().y - it.offsetY()  - this.points()[3])**2) < 30 && it instanceof Socket && it.visible()) {
                    console.log("match");
                    socket = it;
                }
            });
        }
        return socket;
    }
    toJSON() {
        return super.toJSON();
    }

    get direction() {
        return this.attrs.direction;
    }

    set direction(value) {
        this.attrs.direction = value;
    }
    get dragmode() {
        return this.attrs.dragmode;
    }

    set dragmode(value) {
        this.attrs.dragmode = value;
    }
    get connection() {
        return this.attrs.connection;
    }

    set connection(value) {
        this.attrs.connection = value;
    }
}
DynamicArrow.prototype.className = 'DynamicArrow';
_registerNode(DynamicArrow);
export default DynamicArrow;