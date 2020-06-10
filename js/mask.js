function mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 0.1)
}

function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}

function cep(v) {
    v = v.replace(/\D/g, "")
    v = v.replace(/D/g, "")
    v = v.replace(/^(\d{5})(\d)/, "$1-$2")
    return v
}