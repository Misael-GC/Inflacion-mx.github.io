//Guia descuento.js
//Que quieres resolver? calcular la inflación en México
//Encuentra las formulas para encontrar el resultado
//define variables y funciones para resolver tus formulas 
//crea un pagina web 
// organiza y documenta tu código para que sea más facil de leer y entender 
//Publicalo en tu github y muestra el link y show in the platzi box 

function onClickButtonDeflacion(){
    //Extraemos el valor de la caja
    const Inputmoney = document.getElementById("Inputmoney");
    const moneyValue = Inputmoney.value;

    const InputAnio = document.getElementById("InputAnio");
    const anioValue = InputAnio.value;

    const InputAnioBase = document.getElementById("InputAnioBase");
    const anioBaseValue = InputAnioBase.value;

    //preparamos el contexto para ver si el dato que metio el user es valido con .anioB es decir, se ingresa se le agrega la propiedad 
    const isAnioBaseValueValid = function(aniosBase){
        return aniosBase.anioB === anioBaseValue;  
    };
    // Ahora se busca si el dato ingresado por el user esta registrado en el array
    const userAnioBase = inpc.find(isAnioBaseValueValid);
    
    //si no esta arroja este mensaje
    if (!userAnioBase){
        alert("El año " + anioValueBase + " aún no esá registrado");
    }
    //si existe el dato hace esto para que en la siguiente funcion se pueda calcular la deflacion de acuerdo al año base que el user quiera
    else{
        valoresBase = userAnioBase.valor;
    }
    //funcion para calcular la deflación
    function calcularDeflacion(money, valor){/// calcularlos
        const factor = valoresBase / valor;
        const dinero = money * factor;
        
        return dinero;
    }
    // se prepara el contexto para checar si el dato que ingreso el user  
    const isAnioValueValid = function(anios){ 
        return anios.name === anioValue;
    };
    //  Buscar si el dato que ingreso el user existe en el array
    const userAnio = inpc.find(isAnioValueValid);
    // si no existe pon esto
    if (!userAnio){
        alert("El año " + anioValue + " aún no esá registrado");
    }
    //si existe pon este calculo 
    else{
        valores = userAnio.valor;
        const valordeflactado = calcularDeflacion(moneyValue, valores);
        const resultP = document.getElementById("ResultP"); //se escriba en el documento
        resultP.innerText = "El valor de tu efectivo es : $"+ valordeflactado; //se escriba en el documento
    }
}