//Guia descuento.js
//Que quieres resolver? calcular la inflación en México
//Encuentra las formulas para encontrar el resultado
//define variables y funciones para resolver tus formulas 
//crea un pagina web 
// organiza y documenta tu código para que sea más facil de leer y entender 
//Publicalo en tu github y muestra el link y show in the platzi box 

function showModal(message) {
    let modalOverlay = document.getElementById("custom-modal-overlay");
    if (!modalOverlay) {
        modalOverlay = document.createElement("div");
        modalOverlay.id = "custom-modal-overlay";
        modalOverlay.className = "modal-overlay";
        modalOverlay.innerHTML = `
            <div class="modal-card">
                <div class="modal-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <div class="modal-message" id="custom-modal-message"></div>
                <button type="button" class="modal-btn" id="custom-modal-close-btn">Aceptar</button>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        const closeBtn = document.getElementById("custom-modal-close-btn");
        closeBtn.addEventListener("click", () => {
            modalOverlay.classList.remove("active");
        });
    }

    const messageEl = document.getElementById("custom-modal-message");
    messageEl.innerText = message;
    
    modalOverlay.classList.add("active");
}

function onClickButtonDeflacion(){
    //Extraemos el valor de la caja
    const Inputmoney = document.getElementById("Inputmoney");
    const moneyValue = Inputmoney.value;

    const InputAnio = document.getElementById("InputAnio");
    const anioValue = InputAnio.value;

    const InputAnioBase = document.getElementById("InputAnioBase");
    const anioBaseValue = InputAnioBase.value;

    // Validación de campos vacíos
    if (!moneyValue || !anioValue || !anioBaseValue) {
        showModal("Por favor, llena todos los campos para poder realizar el cálculo.");
        return;
    }

    //preparamos el contexto para ver si el dato que metio el user es valido con .anioB es decir, se ingresa se le agrega la propiedad 
    const isAnioBaseValueValid = function(aniosBase){
        return aniosBase.anioB === anioBaseValue;  
    };
    // Ahora se busca si el dato ingresado por el user esta registrado en el array
    const userAnioBase = inpc.find(isAnioBaseValueValid); //si en el futuro quieres que se escoja por mes pon este
    
    //si no esta arroja este mensaje
    if (!userAnioBase){
        showModal(`El año ${anioBaseValue} aún no está registrado.`);
        return;
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
        showModal(`El año ${anioValue} aún no está registrado.`);
        return;
    }
    //si existe pon este calculo 
    else {
        valores = userAnio.valor;
        const valordeflactado = calcularDeflacion(moneyValue, valores);
        const resultP = document.getElementById("ResultP");
        
        const formatter = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
        
        const dineroDeflactadoFormateado = formatter.format(valordeflactado);
        const lossPercent = ((moneyValue - valordeflactado) / moneyValue * 100).toFixed(2);
        
        let lossText = "";
        if (lossPercent > 0) {
            lossText = `Pérdida de poder adquisitivo: <strong>${lossPercent}%</strong>`;
        } else if (lossPercent < 0) {
            lossText = `Ganancia de poder adquisitivo: <strong>${Math.abs(lossPercent)}%</strong>`;
        } else {
            lossText = `Sin cambios en el poder adquisitivo`;
        }

        resultP.innerHTML = `
            <div style="font-size: 1.4rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">El valor equivalente es:</div>
            <div style="font-size: 2.8rem; font-weight: 700; color: var(--green-color); margin-bottom: 0.8rem; text-shadow: 0 0 10px rgba(153, 200, 74, 0.2);">${dineroDeflactadoFormateado}</div>
            <div style="font-size: 1.3rem; color: var(--text-main); font-weight: 400;">${lossText}</div>
        `;
        resultP.classList.add("show");
    }
}

// Lógica de modo oscuro / claro dinámico
const currentTheme = localStorage.getItem("theme") || "dark";
if (currentTheme === "light") {
    document.body.classList.add("light-mode");
}

document.addEventListener("DOMContentLoaded", () => {
    const headerNav = document.querySelector(".header--nav");
    if (headerNav) {
        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.id = "theme-toggle";
        toggleBtn.style.background = "none";
        toggleBtn.style.border = "none";
        toggleBtn.style.color = "var(--text-muted)";
        toggleBtn.style.cursor = "pointer";
        toggleBtn.style.fontSize = "2rem";
        toggleBtn.style.padding = "0.8rem";
        toggleBtn.style.marginRight = "1rem";
        toggleBtn.style.display = "flex";
        toggleBtn.style.alignItems = "center";
        toggleBtn.style.justifyContent = "center";
        toggleBtn.style.boxShadow = "none";
        toggleBtn.style.width = "auto";
        toggleBtn.style.marginTop = "0";
        toggleBtn.style.transition = "color 0.25s ease";

        if (document.body.classList.contains("light-mode")) {
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }

        toggleBtn.addEventListener("click", () => {
            if (document.body.classList.contains("light-mode")) {
                document.body.classList.remove("light-mode");
                localStorage.setItem("theme", "dark");
                toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                document.body.classList.add("light-mode");
                localStorage.setItem("theme", "light");
                toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        });
        
        toggleBtn.addEventListener("mouseenter", () => {
            toggleBtn.style.color = "var(--green-color)";
        });
        toggleBtn.addEventListener("mouseleave", () => {
            toggleBtn.style.color = "var(--text-muted)";
        });

        headerNav.insertBefore(toggleBtn, headerNav.firstChild);
    }
});