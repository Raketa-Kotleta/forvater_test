
import Konva from "konva";
import Socket from "@/classes/Socket";
import {_registerNode} from "konva/lib/Global";


class Element extends Konva.Group{
    constructor(config) {
        super({
            id: config.id,
            x: config.x,
            y: config.y,
            draggable: true,
        });
        this._init(config);
    }
    _init(config){
        const rect_config = {
            x:0,
            y:0,
            width: config.width,
            height: config.height,
            stroke: config.stroke,
            strokeWidth: config.strokeWidth,
            visible: true,
        }
        if (!config.hadChildren){
            this.add(new Konva.Rect(rect_config));
            this.add(this._createSocket('top',config));
            this.add(this._createSocket('right',config));
            this.add(this._createSocket('bottom',config));
            this.add(this._createSocket('left',config));

        }
        this.on('dragend', this._onDragEnd);
    }
    toObject() {
        const obj = super.toObject();
        obj.attrs.hadChildren = true;
        return obj;
    }
    _createSocket(side,config){
        console.log(config);
        const circle_config = {
            id: '',
            x:0,
            y:0,
            fill: "black",
            radius: config.strokeWidth+4,
            offsetX: 0,
            offsetY: 0,
            visible: false,
        }
        switch (side){
            case 'top': {
                circle_config.offsetX = -config.width/2;
                circle_config.offsetY = 0;
            }break;
            case 'right': {
                circle_config.offsetX = -config.width;
                circle_config.offsetY = -config.height/2;
            }break;
            case 'bottom': {
                circle_config.offsetX = -config.width/2;
                circle_config.offsetY = -config.height;
            }break;
            case 'left': {
                circle_config.offsetX = 0;
                circle_config.offsetY = -config.height/2;
            }break;
        }
        circle_config.id = side;
        return new Socket(circle_config);
    }
    _onDragEnd(){
        this.notify(this.children.filter(x=>x instanceof Socket),(it)=>{
           it.dispatchEvent(new Event('dragend'));
        });
    }
    findSocket(side){
        return this.children.filter(it=>it instanceof Socket).find(it=>it.id() == side);
    }
    addSocket(side){
        console.log(this.findSocket(side).visible(true));
    }
    dropSocket(side){
        this.findSocket(side).visible(false);
    }
    notify(objects, callback){
        objects.forEach(o=>{
            if (o)
                callback(o);
        })
    }

}
Element.prototype.className = 'Element';
_registerNode(Element);
export default Element;
