function passwordsMatch() {
    var pwd1, pwd2;
    pwd1 = $('#pwd1').val();
    pwd2 = $('#pwd2').val();
    if (pwd1 === pwd2) {
        return true;
    }
    return false;
}

$(document).ready(function () {
    $('#toLogin').on('click', function () {
        $('#loginDiv').removeClass('hidden');
        $('#registerDiv').addClass('hidden');
    });
    $('#toRegister').on('click', function () {
        $('#registerDiv').removeClass('hidden');
        $('#loginDiv').addClass('hidden');
    });

    $('#register').on('click', function () {
        if (passwordsMatch()) {
            $('#registerForm').submit();
        } else {
            alert("Passwords must match.");
        }
    });

    if (localStorage.clientId === undefined) {
        localStorage.clientId = '1234567';
    }
    if (localStorage.name === undefined) {
        localStorage.name = 'Testihenkilö';
    }
    $('#clientId').val(localStorage.clientId);
    $('#name').val(localStorage.name);
    $('#pwd').val('salainensalasana');
});