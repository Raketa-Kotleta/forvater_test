import {Circle} from "konva/lib/shapes/Circle";
import {_registerNode} from "konva/lib/Global";


class Socket extends Circle{
    _connections;
    constructor(config) {
        super(config);
        this._init();
    }
    _init(){
        this._connections = [];
        this.on('dragend', this._onDragEnd);
    }
    connect(arrow){
        this._connections.push(arrow);
        this.notify(this._connections, it=>it.breakline('row'));
    }
    disconnect(arrow){
        this._connections = this._connections.filter(x=>x!=arrow);
    }
    notify(objects, callback){
        objects.forEach(o=>{
            if (o)
                callback(o);
        })
    }
    _onDragEnd(){
        this.notify(this._connections,(it)=>{
            console.log(it.position().x, it.position().y);
           it.update();
            console.log(it.position().x, it.position().y);
           if (this.id() == 'top' || this.id() == 'bottom')
               it.breakline('column');
           if (this.id() == 'left' || this.id() == 'right')
               it.breakline('row');
        });
        this.getLayer().draw();
    }
    get connections() {
        return this._connections;
    }

    set connections(value) {
        this._connections = value;
    }
}
Socket.prototype.className = "Socket";
_registerNode(Socket);
export default Socket;