$(document).ready(()=>{
    const $ = jQuery.noConflict();
    $("span.decryptButton").on("click",(e)=>{
        const enc_msg = $(e.currentTarget).attr("data")
        $.get('/__get__AES__KEY__',(res)=>{
            const key = res.key;
            const orignal_msg = CryptoJS.AES.decrypt(enc_msg, key).toString(CryptoJS.enc.Utf8);
            $('#decryptedText').text(orignal_msg)
        })
    })

})