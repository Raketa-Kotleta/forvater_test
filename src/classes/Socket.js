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
        this._notifyConnections();
    }
    disconnect(arrow){
        if (this.connections.find(x=>x==arrow))
            this._connections = this._connections.filter(x=>x!=arrow);
    }
    notify(objects, callback){
        objects.forEach(o=>{
            if (o)
                callback(o);
        })
    }
    _notifyConnections(){
        this.notify(this._connections,(it)=>{
            it.update();
            if (this.id() == 'top' || this.id() == 'bottom')
                it.breakline('column');
            if (this.id() == 'left' || this.id() == 'right')
                it.breakline('row');
        });
    }
    _onDragEnd(){
        this._notifyConnections();
        this.getLayer().draw();
    }
    destroy() {
        this.notify(this.connections,(x)=>{x.disconnect()});
        return super.destroy();
    }
    die(){
        this.notify(this.connections,(x)=>{x.disconnect()});
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