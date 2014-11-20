var signup = {

    submit : function() {
        if($('#password').val()!=$('#re_password').val()){
            $('#alert').show();
            return;
        }
       $('#signform').submit();
    }

}

$(function(){
    //$('#alert').alert('close');
});