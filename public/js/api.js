// =============================== APIS ===============================
async function handleAPIRequestCreateNewRoom(username){
    const rawResponse = await fetch(`${DOMAIN_SERVER}/create-room`,{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username})
    });

    return await rawResponse.json();
}

async function handleAPIRequestGetRoomInfoByLinkJoin(linkJoin){
    const rawResponse = await fetch(`${DOMAIN_SERVER}/room-info/${linkJoin}`,{
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    return await rawResponse.json();
}

