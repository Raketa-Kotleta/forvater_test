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
                newLine.points()[0] = this.points()[2];
                newLine.points()[1] = this.points()[1];
                newLine.points()[2] = this.points()[2];
                newLine.points()[3] = this.points()[3];
                this.points()[1] = this.points()[3];
                this.parent.children.splice(this.indexInParent(),0, newLine);
            }
            else if(this.points()[1] < this.points()[3]){
                newLine.points()[2] = this.points()[0];
                newLine.points()[3] = this.points()[1];
                newLine.points()[0] = this.points()[0]
                newLine.points()[1] = this.points()[3];
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
    _onDragStart(){



    }
    _onDragMove(){
        if (this.direction == 'row'){
            this.x(0);
        }
        if (this.direction == 'column'){
            this.y(0)
        }
    }

    _onDragEnd(){
        this.notify();
        const group = this.parent;
        const children = group.children;
        group.removeChildren();
        group.add(...children);
    }
}
export default ArrowLine;