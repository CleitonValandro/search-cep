$('#search-cep .search-address-button').click(function(e) {
    e.preventDefault();
    inputInformation(false);
    updateTable(false);
    var cep = $('#search-cep .cep').val();
    if (cep != "" && cep != null) {
        if (chkCEP(cep)) {
            loader(true);
            buscaCep(cep, function(result) {
                if (result != false) {
                    if (result.erro != true) {
                        $.each(result, function(nameOfElement, valueOfElement) {
                            if (valueOfElement != "" && valueOfElement != null) {
                                $("#tableResult tbody").append("<tr><td>" + nameOfElement + "</td><td>" + valueOfElement + "</td></tr>");
                            }
                        });
                        updateTable(true);
                    } else {
                        inputInformation("This zip code does not exist");
                    }
                } else {
                    inputInformation("An error has occurred, please try again");
                }
                loader(false);
            });
        } else {
            inputInformation("Incorrect CEP");
        }
    } else {
        inputInformation("You must fill this field");
    }
});

//  CEP Validation
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

//  API via CEP
function buscaCep(cep, result) {
    var url = "https://viacep.com.br/ws/" + cep + "/json/";
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        success: function(response) {
            result(response);
        },
        error: function() {
            result(false);
        }
    });
}

//  Input error information
function inputInformation(information) {
    if (information != false) {
        $('#search-cep .cep').addClass('invalid');
        $('#search-cep .input-field-cep span').attr('data-error', information);
    } else {
        $('#search-cep .cep').removeClass('invalid');
        $('#search-cep .input-field-cep span').removeAttr('data-error');
    }

}

// Display and clear the results table
function updateTable(value) {
    if (value) {
        $('#tableResult').removeClass('displayInvisible');
    } else {
        $('#tableResult').addClass('displayInvisible');
        $("#tableResult tbody tr").remove();
    }
}

// Click with enter to search zip code
jQuery('#search-cep .cep').keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $("#search-cep .search-address-button").trigger('click');
    }
});

function loader(params) {
    if (params) {
        $('#search-cep .valueSearch').removeClass('active');
        $('#search-cep .preloader-wrapper').addClass('active');
    } else {
        $('#search-cep .valueSearch').addClass('active');
        $('#search-cep .preloader-wrapper').removeClass('active');
    }
}