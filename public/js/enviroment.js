const DOMAIN_SOCKET = "http://localhost:8000/";
const DOMAIN_SERVER = "http://localhost:8000";
const PEER_CONFIGURATION = {
    iceServers:[
        {
            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}