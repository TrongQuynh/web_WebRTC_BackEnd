const SOCKET_EMIT = {
    RECONNECT: "re-connect",
    NEW_OFFER: "new-offer",
    NEW_ANSWER: "new-answer",
    ICE_CANDIDATE: "ice-candidate"
}

const socket = io.connect(DOMAIN_SOCKET,{
    // auth: {
    //     userName,password
    // }
})

console.log(socket)