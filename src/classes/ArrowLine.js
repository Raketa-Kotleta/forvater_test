import {Line} from "konva/lib/shapes/Line";
const DEFAULT_DRAG_MODE = 'move';
const STRETCH_DRAG_MODE = 'stretch';
class ArrowLine extends Line{
    #ARC_RADIUS = 2;
    direction;
    #connection;



    #dragmode;
    constructor(config) {
        super(config)
        config.draggable = true;
        this.direction = config.direction;
        this.#dragmode = DEFAULT_DRAG_MODE;
        this.#connection = config.connection ?? null;
        this.on('dragstart', this._onDragStart);
        this.on('dragmove', this._onDragMove);
        this.on('dragend', this._onDragEnd);
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
        console.log(this.indexInParent() + 'получил уведомление');
        if (this.parent.children[this.indexInParent()-1]){
            this.points()[0] = this.parent.children[this.indexInParent()-1].attrs.points[2] + this.parent.children[this.indexInParent()-1].x() - this.x();
            this.points()[1] = this.parent.children[this.indexInParent()-1].attrs.points[3] + this.parent.children[this.indexInParent()-1].y() - this.y();
        }
        if (this.parent.children[this.indexInParent()+1]){
            this.points()[2] = this.parent.children[this.indexInParent()+1].attrs.points[0] + this.parent.children[this.indexInParent()+1].x() - this.x();
            this.points()[3] = this.parent.children[this.indexInParent()+1].attrs.points[1] + this.parent.children[this.indexInParent()+1].y() - this.y();
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
        if (Math.abs(this.points()[0] - this.points()[2]) < this.length() && Math.abs(this.points()[1] - this.points()[3]) < this.length()) {
            if (this.direction == 'row'){
                if (this.points()[1] > this.points()[3]){
                    if (this.indexInParent() != 0){
                        this.points()[1] = this.points()[3];
                        this.parent.children.splice(this.indexInParent(),0, newLine);
                    }
                    else{
                        this.points()[2] = this.points()[0];
                        newLine.direction = this.direction;
                        this.parent.children.splice(this.indexInParent()+1,0, newLine);
                        this.direction = 'column'
                    }
                }
                else if(this.points()[1] < this.points()[3]){

                    if (this.indexInParent() != 0){
                        this.points()[1] = this.points()[3];
                        this.parent.children.splice(this.indexInParent(),0, newLine);
                    }
                    else{
                        this.points()[2] = this.points()[0];
                        newLine.direction = this.direction;
                        this.parent.children.splice(this.indexInParent()+1,0, newLine);
                        this.direction = 'column'
                    }
                }
            }
            else{
                if (this.points()[0] > this.points()[2]){
                    this.points()[3] = this.points()[1];
                    this.parent.children.splice(this.indexInParent()+1,0, newLine);
                }
                else if(this.points()[0] < this.points()[2]){
                    this.points()[3] = this.points()[1];
                    this.parent.children.splice(this.indexInParent()+1,0, newLine);
                }
                newLine.direction = 'column';
                this.direction = 'row';
            }
            const indexOfNewLine = this.parent.children.indexOf(newLine);
            newLine.points()[2] = this.parent.children[indexOfNewLine+1].attrs.points[0] + this.parent.children[indexOfNewLine+1].x();
            newLine.points()[3] = this.parent.children[indexOfNewLine+1].attrs.points[1] + this.parent.children[indexOfNewLine+1].y();
            newLine.points()[0] = this.parent.children[indexOfNewLine-1].attrs.points[2] + this.parent.children[indexOfNewLine-1].x();
            newLine.points()[1] = this.parent.children[indexOfNewLine-1].attrs.points[3] + this.parent.children[indexOfNewLine-1].y();
        }

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
        if (Math.sqrt((e.evt.x - (this.points()[0] + this.x()))**2 + (e.evt.y - (this.points()[1]+this.y()))**2) < 10 && this.indexInParent() == 0)
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
            this.x(0);
            this.y(0);
            this.points()[0] = e.evt.x;
            this.points()[1] = e.evt.y;
            this.update();
        }
    }

    _onDragEnd(){
        if (this.#dragmode == STRETCH_DRAG_MODE)
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
        this.#dragmode = DEFAULT_DRAG_MODE
    }
}
export default ArrowLine;