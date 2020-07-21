var searchByCep = $('#search-cep');
var searchByAddress = $('#search-address');

var cep = $('#search-cep .input-cep');
var state = $('#search-address .select-state');
var city = $('#search-address .select-city');
var street = $('#search-address .input-street');

var cepInput = $('#search-cep .input-cep .cep');
var stateSelect = $('#search-address .select-state select');
var citySelect = $('#search-address .select-city select');
var streetInput = $('#search-address .input-street .street');

// click the button to search by CEP
$('#search-cep .search-cep-button').click(function(e) {
    e.preventDefault();
    resetInputInformation(cepInput);
    updateTable(false);
    if (validadeInputsByCep()) {
        loader(searchByCep, true);
        // API for search by CEP
        searchAPI("https://viacep.com.br/ws/" + cepInput.val() + "/json/", function(result) {
            if (result != false) {
                if (result.erro != true) {
                    $.each(result, function(nameOfElement, valueOfElement) {
                        if (valueOfElement != "" && valueOfElement != null) {
                            $("#tableResult tbody").append("<tr><td>" + nameOfElement + "</td><td>" + valueOfElement + "</td></tr>");
                        }
                    });
                    updateTable(true);
                } else {
                    inputInformationAdress(cepInput, "This zip code does not exist");
                }
            } else {
                inputInformationAdress(cepInput,
                    "An error has occurred, please try again");
            }
            loader(searchByCep, false);
        });
    }
});

// click the button to search by address
$('#search-address .search-street-button').click(function(e) {
    e.preventDefault();
    updateTable(false);
    updateError();
    if (validadeInputsByAddress() == true) {
        loader(searchByAddress, true);
        // API for search by address
        searchAPI("https://viacep.com.br/ws/" + stateSelect.val() + "/" + citySelect.val() + "/" + streetInput.val() + "/json/", function(result) {
            if (result != false) {
                $.each(result[0], function(nameOfElement, valueOfElement) {
                    if (valueOfElement != "" && valueOfElement != null) {
                        $("#tableResult tbody").append("<tr><td>" + nameOfElement + "</td><td>" + valueOfElement + "</td></tr>");
                    }
                });
                updateTable(true);
            } else {
                $("#print-error").removeClass('displayInvisible');
            }
            loader(searchByAddress, false);
        });
    }
});

//Increment select city
$(stateSelect).change(function() {
    if ($(this).val() != false) {
        // API for search city
        searchAPI("https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + $(this).val() + "/distritos", function(result) {
            if (result != false) {
                result.sort(function(a, b) {
                    return a.nome.localeCompare(b.nome);
                });
                citySelect.formSelect('destroy');
                citySelect.empty();
                citySelect.append('<option value="0" selected>Choose your option</option>');
                $.each(result, function(nameOfElement, valueOfElement) {
                    citySelect.append('<option value="' + valueOfElement.nome + '">' + valueOfElement.nome + '</option>');
                });
                citySelect.removeAttr("disabled");
                citySelect.formSelect();
            }
        });
    } else {
        citySelect.formSelect('destroy');
        citySelect.empty();
        citySelect.append('<option value="0" selected>Choose your option</option>');
        citySelect.attr('disabled', 'disabled');
        citySelect.formSelect();
        resetSelectInformation(city);
    }
});

//Cleaning the table when changing tabs and increment select state
$('#tabs-cep .search-address').click(function(e) {
    updateTable(false);
    // API for search state
    searchAPI("https://servicodados.ibge.gov.br/api/v1/localidades/estados", function(result) {
        if (result != false) {
            result.sort(function(a, b) {
                return a.nome.localeCompare(b.nome);
            });
            stateSelect.formSelect('destroy');
            $.each(result, function(nameOfElement, valueOfElement) {
                stateSelect.append('<option value="' + valueOfElement.sigla + '">' + valueOfElement.nome + '</option>');
            });
            stateSelect.formSelect();
        }
    });
});

//API for search CEP, address, state and city
function searchAPI(url, result) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: url,
        dataType: "json",
        success: function(response) {
            result(response);
        },
        error: function() {
            result(false);
        }
    });
}

//  Input error information
function validadeInputsByCep() {
    if (cepInput.val() == "") {
        inputInformationAdress(cepInput, 'You must fill this field');
        return false;
    } else if (chkCEP(cepInput.val()) == false) {
        inputInformationAdress(cepInput, 'Incorrect CEP');
        return false;
    } else {
        return true;
    }
}

// validates inputs by address
function validadeInputsByAddress() {
    var valid = false;
    if (stateSelect.val() <= 0) {
        selectInformationAdress(state, 'State selection is required');
        valid = false;
    } else {
        resetSelectInformation(state);
        valid = true;
    }

    if (citySelect.val() <= 0) {
        selectInformationAdress(city, 'City selection is required');
        valid = false;
    } else {
        resetSelectInformation(city);
        valid = true;
    }

    if (streetInput.val().length >= 200) {
        inputInformationAdress(streetInput, 'Maximum 200 characters');
        valid = false;
    } else if (streetInput.val() == "") {
        inputInformationAdress(streetInput, 'Street filling is  required');
        valid = false;
    } else {
        resetInputInformation(streetInput);
        valid = true;
    }
    return valid;
}

//  Input error information
function inputInformationAdress(object, menssage) {
    object.addClass('invalid');
    if (object.nextAll('.helper-text').length == 0) {
        object.nextAll('.label-input').after('<span class="helper-text" data-error="' + menssage + '"></span>');
    }
}
//  Reset input error information
function resetInputInformation(object) {
    object.removeClass('invalid');
    object.nextAll('span').remove();
}

//  Select error information
function selectInformationAdress(object, menssage) {
    if (!object.find('.select-wrapper').hasClass('disabled')) {
        object.find('.select-dropdown').addClass('invalid');
        if (object.find('.select-dropdown').nextAll('.helper-text').length == 0) {
            object.find('.select-dropdown').nextAll('select').after('<span class="helper-text" data-error="' + menssage + '"></span>');
        }
    }
}
//  Select input error information
function resetSelectInformation(object) {
    if (object.find('.select-dropdown').nextAll('select').length > 0) {
        object.find('.select-dropdown').removeClass('invalid');
        object.find('.select-dropdown').nextAll('span').remove();
    }
}

//Cleaning the table when changing tabs
$('#tabs-cep .search-cep').click(function(e) {
    updateTable(false);
    updateError();
});

// tab and select starter
$(document).ready(function() {
    $('.tabs').tabs();
    $('#search-address select').formSelect();
});

// Search button loader effect (search by cep and address)
function loader(local, status) {
    if (status) {
        local.find('.valueSearch').removeClass('active');
        local.find('.preloader-wrapper').addClass('active');
    } else {
        local.find('.valueSearch').addClass('active');
        local.find('.preloader-wrapper').removeClass('active');
    }
}

// Click with enter to search by cep
jQuery(cepInput).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $("#search-cep .search-cep-button").trigger('click');
    }
});

// Click with enter to search by address
jQuery(streetInput).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $("#search-address .search-street-button").trigger('click');
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

// Clear the error
function updateError() {
    if (!$("#print-error").hasClass()) {
        $("#print-error").addClass('displayInvisible');
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