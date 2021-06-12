function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

$(document).ready(()=>{
    const $ = jQuery.noConflict();
    $("span.sendMessage").on("click",(e)=>{
        
        const recipient_name = $(e.currentTarget).attr("data")
        $("#send").on("click",e=>{
            const message = $("#message-text").val().trim()
            if(message.length!=0){
                $.get('/__get__AES__KEY__',(res)=>{
                    const key = res.key;
                    const enc_msg = CryptoJS.AES.encrypt(message, key).toString();
                    $.post('/sendMessage' ,{msg:enc_msg,to:recipient_name}, (res)=>{
                        window.location.href = "/my_outbox"
                    })
                })
            }
        })
    })

})