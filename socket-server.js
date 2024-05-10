const { Server } = require('socket.io');
const utils = require("./public/ultils/ultil");
const SOCKET_ENUM = require("./enums/socket-event.enum");
module.exports = class SocketServer {

    socketIO = null;

    // FOR DATE APP
    _connections = new Map();
    _roomDateAvailable = []; // [linkJoin]

    constructor(server) {
        console.log("[SOCKET-SERVER] - INIT");
        this.socketIO = new Server(server, {
            // options
            cors: {
                origin: ["http://localhost:3000"],
                credentials: true
            },
            transports: ['polling','websocket'],
        });

        this.listenerSocket();
    }

    // SOCKET HANDLE

    listenerSocket() {
        this.socketIO.on(SOCKET_ENUM.SOCKET_CONNECTION, socket => {
            console.log("[SOCKET-SERVER] ", "Someone is connecting!");

            this.socketID = socket.id;

            this.handleSocketAppDate(socket);

            socket.on(SOCKET_ENUM.SOCKET_DISCONNECTION, ()=>{
                console.log("[SOCKET-SERVER] ", "Someone is disconnection!", socket.id);
            })

            socket.on(SOCKET_ENUM.SOCKET_RECONNECT, (data) => {
                // console.log("[SOCKET-SERVER] ", iceCandidate);
            })

        })
    }

    handleSocketAppDate(socket) {
        socket.on(SOCKET_ENUM.SOCKET_DATE_ICE_CANDIDATE, data => {
            const { iceCandidate, linkJoin } = data;
            const room = this._connections.get(linkJoin);
            if(!room) return;
            if(socket.id == room.offerSocketID){
                // ice of offer
                room._offerIceCandadidate.push(iceCandidate);
                if(room.answerSocketID){
                    this.socketIO.to(room.answerSocketID).emit(SOCKET_ENUM.SOCKET_DATE_RECEIVE_ICE_CANDIDATE, iceCandidate);
                }

                this._connections.set(linkJoin, room);
            }
            if(socket.id == room.answerSocketID){
                room._answerIceCandadidate.push(iceCandidate);
                if(room.offerSocketID){
                    this.socketIO.to(room.offerSocketID).emit(SOCKET_ENUM.SOCKET_DATE_RECEIVE_ICE_CANDIDATE, iceCandidate);
                }

                this._connections.set(linkJoin, room);
            }


        })

        socket.on(SOCKET_ENUM.SOCKET_DATE_NEW_ANSWER, room => {
            console.log("[SOCKET-SERVER]", room.offerSocketID);
            const {linkJoin, offerSocketID, answerRtcSessionDes} = room;
            this.socketIO.to(offerSocketID).emit(SOCKET_ENUM.SOCKET_DATE_RECEIVE_ANSWER, answerRtcSessionDes);
            console.log("[SOCKET-SERVER] ", "New date Answer");
        })

        socket.on(SOCKET_ENUM.SOCKET_DATE_FIND_TARGET_AVAILABLE, data => {
            const {offer, username}  =data;
            if(this._roomDateAvailable.length > 0){
                const targetRoom = this._connections.get(this._roomDateAvailable[0])
                if(!targetRoom) return;
                targetRoom.answerSocketID = socket.id;
                this._connections.set(this._roomDateAvailable[0], targetRoom);
                socket.emit(SOCKET_ENUM.SOCKET_DATE_NEW_ANSWER, targetRoom);
                this._roomDateAvailable = this._roomDateAvailable.filter(link => link != this._roomDateAvailable[0]);
            }else{
                const newConnect = {
                    ...this.createNewRoomDate(socket.id),
                    offerRtcSessionDes: offer,
                    offerName: username
                };
                this._connections.set(newConnect.linkJoin, newConnect)
    
                this._roomDateAvailable.push(newConnect.linkJoin);
                socket.emit(SOCKET_ENUM.SOCKET_DATE_RECEIVE_OFFER, newConnect);
            }
        })
    }



    // SUPPORTS


    createNewRoomDate(socketID) {
        const linkJoin = utils.generateLinkJoin();
        const newRoom = {
            linkJoin,
            offerSocketID: socketID,
            offerName: '',
            offerRtcSessionDes: null,
            _offerIceCandadidate: [],
            answerSocketID: null,
            answerName: '',
            answerRtcSessionDes: null,
            _answerIceCandadidate: [],
        }

        return newRoom;
    }

    handleUserJoinRoom(data, socketID) {
        const { username, linkJoin } = data;
        const memberID = utils.random4NumberDigits();
        const newMember = {
            id: memberID,
            linkJoin,
            username,
            socketID,
            offer: null,
            iceCandidates: []
        };

        this._members.set(socketID, newMember);
        this._rooms = this._rooms.map(room => {
            if (room.linkJoin == linkJoin) room.members.push(memberID)
            return room;
        })
        return newMember;
    }

    handleUserOutRoom(socketID) {
        const member = this._members.get(socketID);
        if (!member) return;
        this._rooms = this._rooms.map(room => {
            if (room.linkJoin == member.linkJoin) {
                room.members = room.members.filter(id => id != member.id)
            }
            return room;
        })
        this._members.delete(socketID);
    }

    getInfoRoomByLinkJoin(linkJoin) {
        return this._rooms.find(room => room.linkJoin == linkJoin)
    }

    handleAddNewIceCandidate(data) {
        const { iceCandidate, socketID, linkJoin } = data;
        const member = this._members.get(socketID);
        if (!member) return;

        member.iceCandidates.push(iceCandidate);

        this._members.set(socketID, member);

    }

}