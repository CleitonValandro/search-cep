$('#search-cep .search-address-button').click(function(e) {
    e.preventDefault();
    var cep = $('#search-cep .cep').val();
    if (chkCEP(cep)) {
        alert('Cép é válido');
    } else {
        // Create information in the field
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