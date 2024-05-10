

let roomInfo = null;
let userInfo = null;

let localVideoElement, remoteVideoElement;

let peerConnection;

let localStream, remoteStream;


function enableUserMedia() {
    return new Promise(async (resolve, reject)=>{
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                // audio: true,
            });

            $("#local_video").prop('srcObject', stream);

            localStream = stream;

            resolve();
        } catch (error) {
            console.log("[ERROR]: enableUserMedia ", error);
            reject();
        }
    })
}

function showLinkJoin(linkJoin){
    $("#link_join").html(linkJoin);
}

function createPeerConnection(offerObj){
    return new Promise(async(resolve, reject)=>{
        peerConnection = await new RTCPeerConnection(PEER_CONFIGURATION);

        remoteStream = new MediaStream()

        $("#remote_video").prop('srcObject', remoteStream);

        localStream.getTracks().forEach(track=>{
            //add localtracks so that they can be sent once the connection is established.
            peerConnection.addTrack(track,localStream);
        })

        peerConnection.addEventListener("signalingstatechange", (event) => {
            // console.log("[PEER_CONNECTION_EVENT]","signalingstatechange",event)
            // console.log(peerConnection.signalingState)
        });

        peerConnection.addEventListener('icecandidate', e =>{
            if(e.candidate){
                console.log("[PEER-CONNECTION] - icecandidate");
                socket.emit(SOCKET_EMIT.ICE_CANDIDATE,{
                    iceCandidate: e.candidate,
                    iceUserName: "Phong23423423",
                    didIOffer: true,
                })    
            }
        })
        
        peerConnection.addEventListener('track',e=>{
            // When user click answer button
            console.log("[PEER_CONNECTION_EVENT]","track",e)
            e.streams[0].getTracks().forEach(track=>{
                remoteStream.addTrack(track,remoteStream);
                console.log("Here's an exciting moment... fingers cross", track)
            })
        })

        if(offerObj){
            //this won't be set when called from call();
            //will be set when we call from answerOffer()
            await peerConnection.setRemoteDescription(offerObj.offer); // Nó giúp trình duyệt của bạn biết được cấu hình media của đối tác, cần giải mã và xử lý dữ liệu media nào.
        }
        resolve();
    })
}

async function handleActionCallVideo(){

    try {
        await enableUserMedia();

        await createPeerConnection();

        const offer = await peerConnection.createOffer();

        peerConnection.setLocalDescription(offer);

        socket.emit(SOCKET_EMIT.NEW_OFFER, {offer, linkJoin: roomInfo.linkJoin});

    } catch (error) {
        console.log("[ERROR]: handleActionCallVideo ", error);
    }

}

function getUrlParmas(){
    const urlParams = new URLSearchParams(window.location.search);
    const linkJoin = window.location.pathname.split("/")[2]; // ["","call","1715072965877-aQh7J1Jt"]
    const userID = urlParams.get("ui") ? atob(urlParams.get("ui")) : null;
    return {linkJoin, userID}
}

async function initData(){
   
    const {linkJoin, userID} = getUrlParmas();

    const {status, data} = await handleAPIRequestGetRoomInfoByLinkJoin(linkJoin);

    if(status !== 200) { window.location.href = "/"; return; }

    roomInfo = data;

    showLinkJoin(data.linkJoin);

    await handleActionCallVideo();
    
}

window.addEventListener("DOMContentLoaded", async function(){
    await initData();
})