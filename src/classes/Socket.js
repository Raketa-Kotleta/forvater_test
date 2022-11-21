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
<<<<<<< HEAD
        this._notifyConnections();
    }
    disconnect(arrow){
        if (this.connections.find(x=>x==arrow))
            this._connections = this._connections.filter(x=>x!=arrow);
=======
        this.notify(this._connections, it=>it.breakline('row'));
    }
    disconnect(arrow){
        this._connections = this._connections.filter(x=>x!=arrow);
>>>>>>> 126855a (work arrow vers 1)
    }
    notify(objects, callback){
        objects.forEach(o=>{
            if (o)
                callback(o);
        })
    }
<<<<<<< HEAD
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

=======
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
>>>>>>> 126855a (work arrow vers 1)
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