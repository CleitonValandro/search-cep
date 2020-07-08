var state = $('#search-address .select-state select');
var city = $('#search-address .select-city select');
var stateSelected = $('#search-address .select-state option:selected').text();
var CitySelected = $('#search-address .select-city option:selected').text();
var AddressSelected = $('#search-address .input-address .address').val();

// click the button to search by CEP
$('#search-cep .search-cep-button').click(function(e) {
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

// click the button to search by address
$('#search-address .search-address-button').click(function(e) {
    e.preventDefault();
    inputInformation(false);
    updateTable(false);
});

//Increment select state
$(state).change(function() {
    if ($(this).val() != false) {
        incrementCity($(this).val(), function(result) {
            if (result != false) {
                result.sort(function(a, b) {
                    return a.nome.localeCompare(b.nome);
                });
                city.formSelect('destroy');
                city.empty();
                city.append('<option value="0" selected>Choose your option</option>');
                $.each(result, function(nameOfElement, valueOfElement) {
                    city.append('<option value="' + valueOfElement.nome + '">' + valueOfElement.nome + '</option>');
                });
                city.removeAttr("disabled");
                city.formSelect();
            }
        });
    }
});

//Cleaning the table when changing tabs
$('#tabs-cep .search-cep').click(function(e) {
    updateTable(false);
});

//Cleaning the table when changing tabs and increment select state
$('#tabs-cep .search-address').click(function(e) {
    updateTable(false);
    incrementState(function(result) {
        if (result != false) {
            result.sort(function(a, b) {
                return a.nome.localeCompare(b.nome);
            });
            state.formSelect('destroy');
            $.each(result, function(nameOfElement, valueOfElement) {
                state.append('<option value="' + valueOfElement.sigla + '">' + valueOfElement.nome + '</option>');
            });
            state.formSelect();
        }
    });
});

//API for search state
function incrementState(result) {
    var urlEstado = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
    $.ajax({
        type: "GET",
        url: urlEstado,
        dataType: "json",
        success: function(response) {
            result(response);
        },
        error: function() {
            result(false);
        }
    });
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

// API for search city
function incrementCity(state, result) {
    var urlCity = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + state + "/distritos";
    $.ajax({
        type: "GET",
        url: urlCity,
        dataType: "json",
        success: function(response) {
            result(response);
        },
        error: function() {
            result(false);
        }
    });
}

// tab starter
$(document).ready(function() {
    $('.tabs').tabs();
});

// select starter
$(document).ready(function() {
    $('#search-address select').formSelect();
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

// Click with enter to search zip code
jQuery('#search-cep .cep').keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $("#search-cep .search-cep-button").trigger('click');
    }
});

// Display and clear the results table
function updateTable(value) {
    if (value) {
        $('#tableResult').removeClass('displayInvisible');
    } else {
        $('#tableResult').addClass('displayInvisible');
        $("#tableResult tbody tr").remove();
    }
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