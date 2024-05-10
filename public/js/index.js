
// =============================== SUPPORTS ===============================

async function handleCreateRoomChat(){
   const usernameVal = $("#txt_username").val();
   if(String(usernameVal).length == 0) return;

   const response = await handleAPIRequestCreateNewRoom(usernameVal);
    const {linkJoin, userID} = response.data;
   window.location.href = `/call/${linkJoin}?ui=${btoa(userID)}`;
   
}

function init(){
    $("#btn_create_room").click(handleCreateRoomChat);
}

// =============================== START ===============================

window.addEventListener("DOMContentLoaded", function(){
    init();
})

