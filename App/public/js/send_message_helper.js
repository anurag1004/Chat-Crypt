$(document).ready(()=>{
    const $ = jQuery.noConflict();
    $("span.sendMessage").on("click",(e)=>{
        
        const recipient_name = $(e.currentTarget).attr("data")
        $("#send").on("click",e=>{
            const message = $("#message-text").val().trim()
            console.log(message)
            if(message.length!=0){
                $.post('/sendMessage' ,{msg:message,to:recipient_name}, (res)=>{
                    window.location.href = "/my_outbox"
                })
            }
        })
    })

})