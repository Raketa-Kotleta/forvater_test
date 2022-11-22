import {Line} from "konva/lib/shapes/Line";
import {_registerNode} from "konva/lib/Global";
import Element from "@/classes/Element";
import Socket from "@/classes/Socket";

const DEFAULT_DRAG_MODE = 'move';
const STRETCH_DRAG_MODE = 'stretch';
class ArrowLine extends Line{
    #arc_radius;
    constructor(config) {
        super(config)
        this._init(config);
    }
    _init(config){
        config.draggable = true;
        this.#arc_radius = config.strokeWidth;
        this.attrs.direction = config.direction;
        this.attrs.dragmode = DEFAULT_DRAG_MODE;
        this.attrs.connection = config.connection ?? null;
        this._connectionHandler = config.connectionHandler;
        this.on('dragstart', this._onDragStart);
        this.on('dragmove', this._onDragMove);
        this.on('dragend', this._onDragEnd);

    }
    _indexInParent(){
        return this.parent.children.indexOf(this);
    }
    _length(){
        return Math.sqrt((this.points()[0] - this.points()[2])**2+(this.points()[1]-this.points()[3])**2);
    }
    notify(objects, callback){
        objects.forEach(o=>{
            if (o)
                callback(o);
        })
    }
    update(){
        if (this.connection && this._indexInParent() == 0 && this.dragmode == DEFAULT_DRAG_MODE){
            this.points()[0] = this.attrs.connection.parent.position().x - this.attrs.connection.offsetX();
            this.points()[1] = this.attrs.connection.parent.position().y - this.attrs.connection.offsetY();
        }
        if (this.parent.children[this._indexInParent() - 1]) {
            this.points()[0] = this.parent.children[this._indexInParent() - 1].attrs.points[2] + this.parent.children[this._indexInParent() - 1].x() - this.x();
            this.points()[1] = this.parent.children[this._indexInParent() - 1].attrs.points[3] + this.parent.children[this._indexInParent() - 1].y() - this.y();
        }

        if (this.parent.children[this._indexInParent()+1]){
            this.points()[2] = this.parent.children[this._indexInParent()+1].attrs.points[0] + this.parent.children[this._indexInParent()+1].x() - this.x();
            this.points()[3] = this.parent.children[this._indexInParent()+1].attrs.points[1] + this.parent.children[this._indexInParent()+1].y() - this.y();
        }
    }
    breakline(mode = 'row'){
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
        if (Math.abs(this.points()[0] - this.points()[2]) < this._length() && Math.abs(this.points()[1] - this.points()[3]) < this._length()) {
            if (this._indexInParent() == 0){
                if (mode == 'row'){
                    this.points()[3] = this.points()[1];
                    this.direction = 'row';
                    newLine.direction = 'column';
                }
                else if (mode == 'column'){
                    this.points()[2] = this.points()[0];
                    this.direction = 'column';
                    newLine.direction = "row";
                }
            }else{
                if (this.points()[1] > this.points()[3]){
                    this.points()[3] = this.points()[1];
                }
                else if(this.points()[1] < this.points()[3]){
                    this.points()[3] = this.points()[1];
                }
                this.direction = "row";
                newLine.direction = "column";
            }

            let indexOfNewLine = 0;
            if (this.parent.children[this._indexInParent()+1].direction == this.direction){
                    this.parent.children.splice(this._indexInParent()+1, 0, newLine);
                    indexOfNewLine = this.parent.children.indexOf(newLine);
                    newLine.points()[2] = this.parent.children[indexOfNewLine + 1].attrs.points[0] + this.parent.children[indexOfNewLine + 1].x();
                    newLine.points()[3] = this.parent.children[indexOfNewLine + 1].attrs.points[1] + this.parent.children[indexOfNewLine + 1].y();
                    newLine.points()[0] = this.parent.children[indexOfNewLine - 1].attrs.points[2] + this.parent.children[indexOfNewLine - 1].x();
                    newLine.points()[1] = this.parent.children[indexOfNewLine - 1].attrs.points[3] + this.parent.children[indexOfNewLine - 1].y();
                }
                else{
                    this.parent.children[this._indexInParent()+1].update();
                }
        }

    }
    _sceneFunc(context) {
        super._sceneFunc(context);
        context.beginPath();
            context.arc(
                (this.points()[0]+this.points()[2])/2,
                (this.points()[1]+this.points()[3])/2,
                this.#arc_radius,
                0,
                2 * Math.PI,
                false
            );
        context.closePath();
        context.fillStrokeShape(this);
    }
    _onDragStart(e){
        if (Math.sqrt((e.evt.x - (this.points()[0] + this.x()))**2 + (e.evt.y - (this.points()[1]+this.y()))**2) < 30 && this._indexInParent() == 0)
            this.dragmode = STRETCH_DRAG_MODE;
    }
    _onDragMove(e){
        if (this.direction == 'row'){
            this.x(0);
        }
        if (this.direction == 'column'){
            this.y(0)
        }
        if (this.dragmode == STRETCH_DRAG_MODE || this.connection){
            this.x(0);
            this.y(0);
            this.points()[0] = e.evt.x;
            this.points()[1] = e.evt.y;
            this.update();
        }
    }

    _onDragEnd(){
        if (this.dragmode == STRETCH_DRAG_MODE) {
            const socket = this._findMatches();
            if (socket){
                this.connect(socket);
            }
            else{
                if (this.connection)
                    this.disconnect();
                this.breakline("column");
            }
        }
        else
            this.notify(
                [this.parent.children[this._indexInParent()-1], this.parent.children[this._indexInParent()+1]],
                (it)=>{
                    it.update();
                    it.breakline("row");
                }
            );
        const group = this.parent;
        const children = group.children;
        group.removeChildren();
        children.filter(it=>it._length() == 0).forEach(it=>it.destroy());
        group.add(...children);
        this.dragmode = DEFAULT_DRAG_MODE;
    }
    toObject() {
        let obj =  super.toObject();
        obj.attrs.connectionHandler = null;
        if (this.connection)
            obj.attrs.connectionHandler = {
                elementId: this.connection.parent.id(),
                socketId: this.connection.id(),
            }
        return obj;
    }
    recoverConnection(){
        if (this._connectionHandler) {
            const socket = this.getLayer().children.find(x=>x.id()===this._connectionHandler.elementId).children.find(x=>x.id()===this._connectionHandler.socketId);
            this.connect(socket);
        }
    }
    connect(socket){
        this.attrs.connection = socket;
        this.notify([socket], it=>it.connect(this));
    }
    disconnect(){
        this.notify([this.connection],it=>{it.disconnect(this)})
        this.connection = null;
    }
    destroy() {
        this.disconnect();
        return super.destroy();
    }
    dire
    _findMatches(){
        let socket = null
        let elements = this.getLayer().children.filter(it => it instanceof Element);
        for (let element of elements){
            element.children.forEach(it => {
                if (Math.sqrt((it.parent.position().x - it.offsetX() - this.points()[0])**2 + (it.parent.position().y - it.offsetY()  - this.points()[1])**2) < it.attrs.radius + 3
                    && it instanceof Socket
                    && it.visible()
                    && this._indexInParent() == 0) {
                    console.log("match");
                    socket = it;
                }
            });
        }
        return socket;
    }
    get direction() {
        return this.attrs.direction;
    }

    set direction(value) {
        this.attrs.direction = value;
    }

    get connection() {
        return this.attrs.connection;
    }

    set connection(value) {
        this.attrs.connection = value;
    }
    get dragmode() {
        return this.attrs.dragmode;
    }

    set dragmode(value) {
        this.attrs.dragmode = value;
    }

    get arc_radius() {
        return this.arc_radius;
    }
}
ArrowLine.prototype.className = "ArrowLine";
_registerNode(ArrowLine);
export default ArrowLine;