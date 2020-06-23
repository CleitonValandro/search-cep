$('#search-cep .search-address-button').click(function(e) {
    e.preventDefault();
    inputInformation(false);
    var cep = $('#search-cep .cep').val();
    if (cep != "" && cep != null) {
        if (chkCEP(cep)) {
            alert(buscaCep(cep));
        } else {
            inputInformation("Incorrect CEP")
        }
    } else {
        inputInformation("You must fill this field")
    }
});

//  CEP Validation - Start
function Trim(strTexto) {
    return strTexto.replace(/^\s+|\s+$/g, '');
}

function IsCEP(strCEP, blnVazio) {
    var objER = /^[0-9]{5}-[0-9]{3}$/;
    strCEP = Trim(strCEP)
    if (strCEP.length > 0) {
        if (objER.test(strCEP))
            return true;
        else
            return false;
    } else
        return blnVazio;
}

function chkCEP(strCEP) {
    var Retorno = IsCEP(strCEP, false)
    if (Retorno) return true;
    else return false;
}
//  CEP Validation - End

//  API via CEP - Start
function buscaCep(cep) {
    var url = "https://viacep.com.br/ws/" + cep + "/json/";
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        success: function(response) {
            return response;
        },
        error: function() {
            return false;
        }
    });
}
//  API via CEP - End

//  Input error information - Start
function inputInformation(information) {
    if (information != false) {
        $('#search-cep .cep').addClass('invalid');
        $('#search-cep .input-field-cep span').attr('data-error', information);
    } else {
        $('#search-cep .cep').removeClass('invalid');
        $('#search-cep .input-field-cep span').removeAttr('data-error');
    }

}
//  Input error information - End