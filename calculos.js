// Guia descuento.js
// Que quieres resolver? calcular la inflación en México
// Encuentra las formulas para encontrar el resultado
// define variables y funciones para resolver tus formulas 
// crea un pagina web 
// organiza y documenta tu código para que sea más facil de leer y entender 
// Publicalo en tu github y muestra el link y show in the platzi box 

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
    // Extraemos el valor de la caja y sanitizamos limpiando espacios
    const Inputmoney = document.getElementById("Inputmoney");
    const rawMoneyValue = Inputmoney.value.trim();

    const InputAnio = document.getElementById("InputAnio");
    const rawAnioValue = InputAnio.value.trim();

    const InputAnioBase = document.getElementById("InputAnioBase");
    const rawAnioBaseValue = InputAnioBase.value.trim();

    // Validación 1: Campos vacíos
    if (!rawMoneyValue || !rawAnioValue || !rawAnioBaseValue) {
        showModal("Por favor, llena todos los campos para poder realizar el cálculo.");
        return;
    }

    // Validación 2: Conversión estricta a números (Prevención de inyección y XSS)
    // Usamos Number() para evitar que "10a" pase como válido (como haría parseInt)
    const moneyValue = Number(rawMoneyValue);
    const anioValue = Number(rawAnioValue);
    const anioBaseValue = Number(rawAnioBaseValue);

    // Validación 3: Tipos de datos y estructura correcta (evita letras o NaN)
    if (isNaN(moneyValue) || isNaN(anioValue) || isNaN(anioBaseValue)) {
        showModal("Error: Ingresa únicamente valores numéricos válidos. No se permiten letras ni símbolos raros.");
        return;
    }

    // Validación 4: Rangos lógicos y matemáticos
    if (moneyValue <= 0) {
        showModal("El valor del dinero debe ser mayor a 0.");
        return;
    }

    if (!Number.isInteger(anioValue) || !Number.isInteger(anioBaseValue)) {
        showModal("Los años deben ser números enteros.");
        return;
    }

    // Validación 5: Limitar años históricos (Banxico tiene registros sólidos desde ~1969)
    if (anioValue < 1969 || anioValue > 2100 || anioBaseValue < 1969 || anioBaseValue > 2100) {
        showModal("Por favor ingresa años válidos (entre 1969 y la actualidad).");
        return;
    }
    
    if (anioBaseValue >= anioValue) {
        showModal("El año base debe ser estrictamente menor al año actual o más reciente.");
        return;
    }

    // Asegurarnos de que los datos de inflación estén cargados en window.inpc
    const activeInpc = window.inpc;
    if (!activeInpc) {
        showModal("Los datos de inflación no se han cargado correctamente. Por favor intenta de nuevo en unos momentos.");
        return;
    }

    // preparamos el contexto para ver si el dato que metio el user es valido con .anioB
    const isAnioBaseValueValid = function(aniosBase){
        return String(aniosBase.anioB) === String(anioBaseValue);  
    };
    // Ahora se busca si el dato ingresado por el user esta registrado en el array
    const userAnioBase = activeInpc.find(isAnioBaseValueValid);
    
    // si no esta arroja este mensaje
    if (!userAnioBase){
        showModal(`El año ${anioBaseValue} aún no está registrado.`);
        return;
    }
    // si existe el dato hace esto
    else{
        valoresBase = userAnioBase.valor;
    }
    
    // funcion para calcular la deflación
    function calcularDeflacion(money, valor){
        const factor = valoresBase / valor;
        const dinero = money * factor;
        
        return dinero;
    }
    
    // se prepara el contexto para checar si el dato que ingreso el user  
    const isAnioValueValid = function(anios){ 
        return String(anios.name) === String(anioValue);
    };
    // Buscar si el dato que ingreso el user existe en el array
    const userAnio = activeInpc.find(isAnioValueValid);
    
    // si no existe pon esto
    if (!userAnio){
        showModal(`El año ${anioValue} aún no está registrado.`);
        return;
    }
    // si existe pon este calculo 
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
            <div id="animatedResult" style="font-size: 2.8rem; font-weight: 700; color: var(--green-color); margin-bottom: 0.8rem; text-shadow: 0 0 10px rgba(153, 200, 74, 0.2);">$0.00</div>
            <div style="font-size: 1.3rem; color: var(--text-main); font-weight: 400;">${lossText}</div>
        `;
        resultP.classList.add("show");

        // --- Animar el número ---
        const animatedResultEl = document.getElementById("animatedResult");
        if (animatedResultEl) {
            animateValue(animatedResultEl, 0, valordeflactado, 1200); // Animación dura 1.2 segundos
        }

        // --- Renderizar Gráfica ---
        const startYear = Math.min(anioBaseValue, anioValue);
        const endYear = Math.max(anioBaseValue, anioValue);
        
        const historicalData = activeInpc
            .filter(item => {
                const year = Number(item.name);
                return year >= startYear && year <= endYear;
            })
            .sort((a, b) => Number(a.name) - Number(b.name));
            
        renderInflationChart(historicalData, anioBaseValue, moneyValue);
    }
}

// Función para animar números fluidamente (Odómetro)
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing: Frenado suave al final (easeOutQuart)
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOut;
        
        obj.innerHTML = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(current);
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

let inflationChartInstance = null;

function renderInflationChart(historicalData, anioBaseValue, moneyValue) {
    const chartSection = document.getElementById('chart-section');
    const ctx = document.getElementById('inflationChart');
    
    if (!chartSection || !ctx) return;
    
    chartSection.style.display = 'block';

    if (inflationChartInstance) {
        inflationChartInstance.destroy();
    }

    const labels = historicalData.map(item => item.name);
    
    const baseItem = historicalData.find(item => Number(item.name) === anioBaseValue);
    const inpcBase = baseItem ? baseItem.valor : historicalData[0].valor;

    const dataPoints = historicalData.map(item => {
        const factor = inpcBase / item.valor;
        return (moneyValue * factor).toFixed(2);
    });

    const isDarkMode = document.body.classList.contains("light-mode") ? false : true;
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDarkMode ? '#a0a6b2' : '#6b7280';

    inflationChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Poder Adquisitivo (MXN)',
                data: dataPoints,
                borderColor: '#99c84a',
                backgroundColor: 'rgba(153, 200, 74, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: '#99c84a',
                pointBorderColor: isDarkMode ? '#181818' : '#f3f4f6',
                pointHoverBackgroundColor: '#aadc5c',
                pointHoverBorderColor: '#ffffff',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: textColor, font: { family: 'Outfit' } }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? '#2c2f33' : '#ffffff',
                    titleColor: isDarkMode ? '#ffffff' : '#2c2f33',
                    bodyColor: isDarkMode ? '#a0a6b2' : '#6b7280',
                    borderColor: '#99c84a',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            let value = context.parsed.y;
                            return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: gridColor, drawBorder: false },
                    ticks: { color: textColor, font: { family: 'Outfit' } }
                },
                y: {
                    grid: { color: gridColor, drawBorder: false },
                    ticks: {
                        color: textColor,
                        font: { family: 'Outfit' },
                        callback: function(value) { return '$' + value; }
                    }
                }
            }
        }
    });
}

// Mapeo de meses y sus respectivos archivos de datos e identificadores visuales
const monthMapping = {
    enero: { file: "enero.js", display: "Enero", num: "01" },
    febrero: { file: "feb.js", display: "Febrero", num: "02" },
    marzo: { file: "marzo.js", display: "Marzo", num: "03" },
    abril: { file: "abril.js", display: "Abril", num: "04" },
    mayo: { file: "mayo.js", display: "Mayo", num: "05" },
    junio: { file: "junion.js", display: "Junio", num: "06" },
    julio: { file: "julio.js", display: "Julio", num: "07" },
    agosto: { file: "agosto.js", display: "Agosto", num: "08" },
    septiembre: { file: "sep.js", display: "Septiembre", num: "09" },
    octubre: { file: "oct.js", display: "Octubre", num: "10" },
    noviembre: { file: "nov.js", display: "Noviembre", num: "11" },
    diciembre: { file: "dic.js", display: "Diciembre", num: "12" }
};

// --- ARQUITECTURA SOLID CON BANXICO API ---

// 1. Clase para leer la configuración (Single Responsibility Principle)
class Config {
    static getApiUrl() {
        return window.APP_CONFIG ? window.APP_CONFIG.API_BANXICO_URL : "/.netlify/functions/banxico";
    }
}

// 2. Abstracción del Proveedor de Inflación (Open/Closed Principle & Dependency Inversion)
class InflationProvider {
    async getINPCData(monthKey) {
        throw new Error("getINPCData method must be implemented");
    }
}

// 3. Proveedor Concreto: API de Banxico (Strategy Pattern)
class BanxicoApiInflationProvider extends InflationProvider {
    constructor() {
        super();
        this.cachedData = null;
    }

    async getINPCData(monthKey) {
        const monthConfig = monthMapping[monthKey];
        if (!monthConfig) throw new Error("Mes no válido");

        if (!this.cachedData) {
            // Consumimos nuestra API Serverless de Netlify que funciona como Proxy seguro
            const apiUrl = Config.getApiUrl();
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Respuesta fallida del servidor de Banxico API");
            }
            const json = await response.json();
            if (!json || !json.bmx || !json.bmx.series || !json.bmx.series[0].datos) {
                throw new Error("La estructura de datos de Banxico no es la esperada");
            }
            this.cachedData = json.bmx.series[0].datos;
        }

        // Filtramos por el mes solicitado y mapeamos al formato original ({ name, anioB, valor })
        return this.cachedData
            .filter(item => {
                const parts = item.fecha.split('/');
                return parts[1] === monthConfig.num;
            })
            .map(item => {
                const year = item.fecha.split('/')[2];
                return {
                    name: year,
                    anioB: year,
                    valor: parseFloat(item.dato)
                };
            });
    }
}

// 4. Proveedor Concreto: Fallback de Archivos Locales (Strategy Pattern)
class LocalFileInflationProvider extends InflationProvider {
    async getINPCData(monthKey) {
        const monthConfig = monthMapping[monthKey] || monthMapping.diciembre;
        const response = await fetch(`./meses/${monthConfig.file}`);
        if (!response.ok) {
            throw new Error(`No se pudieron cargar los datos locales del mes ${monthConfig.display}`);
        }
        const scriptText = await response.text();
        const modifiedScript = scriptText.replace(/const\s+inpc\s*=/, "window.inpc =");
        new Function(modifiedScript)();
        return window.inpc;
    }
}

// 5. Servicio de Inflación (Repository / Facade Pattern)
class InflationService {
    constructor() {
        this.apiProvider = new BanxicoApiInflationProvider();
        this.localProvider = new LocalFileInflationProvider();
    }

    async getINPC(monthKey) {
        try {
            console.log("Consultando API de Banxico...");
            return await this.apiProvider.getINPCData(monthKey);
        } catch (error) {
            console.warn("Fallo de Banxico API. Utilizando archivos locales de respaldo:", error.message);
            return await this.localProvider.getINPCData(monthKey);
        } finally {
            console.log(`[Service] Consulta de inflación finalizada para el mes: ${monthKey}`);
        }
    }
}

// Instanciamos el servicio único de inflación
const inflationService = new InflationService();

let currentMonth = localStorage.getItem("selectedMonth") || (window.APP_CONFIG ? window.APP_CONFIG.DEFAULT_MONTH : "diciembre");

async function loadMonthData(monthKey) {
    const config = monthMapping[monthKey] || monthMapping.diciembre;
    try {
        // Obtenemos los datos desde el servicio con patrón de recuperación local automática
        window.inpc = await inflationService.getINPC(monthKey);
        
        // Actualizamos el DOM del mes activo
        const activeMonthText = document.getElementById("active-month-text");
        if (activeMonthText) {
            activeMonthText.innerText = config.display;
        }
        
        currentMonth = monthKey;
        localStorage.setItem("selectedMonth", monthKey);
        
        // Ocultar resultados previos al cambiar de mes
        const resultP = document.getElementById("ResultP");
        if (resultP) {
            resultP.classList.remove("show");
        }
    } catch (error) {
        showModal(`Error al cargar datos de inflación: ${error.message}`);
    } finally {
        // En este bloque finally se pueden apagar animaciones de carga (spinners), 
        // cerrar conexiones o hacer limpieza de variables si fuera necesario.
        console.log(`[DOM] Carga de UI concluida para: ${monthKey}`);
    }
}

// Lógica de modo oscuro / claro dinámico
const currentTheme = localStorage.getItem("theme") || (window.APP_CONFIG ? window.APP_CONFIG.DEFAULT_THEME : "dark");
if (currentTheme === "light") {
    document.body.classList.add("light-mode");
}

document.addEventListener("DOMContentLoaded", () => {
    // Configurar e inyectar el switch de modo oscuro / claro
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
            
            // Si la gráfica ya está dibujada, la re-dibujamos para que cambie de color (Dark/Light)
            if (inflationChartInstance) {
                onClickButtonDeflacion();
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

    // Configurar el botón de menú hamburguesa para toggle con click
    const menuBtn = document.querySelector(".meses");
    const menuVertical = document.querySelector(".menu-vertical");

    if (menuBtn && menuVertical) {
        menuBtn.addEventListener("click", (e) => {
            e.preventDefault();
            menuVertical.classList.toggle("active");
        });

        // Cerrar el menú al dar clic en cualquier parte fuera del botón o del menú
        document.addEventListener("click", (e) => {
            if (!menuBtn.contains(e.target) && !menuVertical.contains(e.target)) {
                menuVertical.classList.remove("active");
            }
        });
    }

    // Configurar los clicks en los meses
    const monthLinks = document.querySelectorAll(".month-link");
    monthLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const selectedMonthKey = link.getAttribute("data-month");
            loadMonthData(selectedMonthKey);
            
            // Cerrar el menú tras seleccionar un mes
            if (menuVertical) {
                menuVertical.classList.remove("active");
            }
        });
    });

    // Cargar los datos del mes seleccionado por defecto al inicio
    loadMonthData(currentMonth);

    // --- PWA: Registro del Service Worker ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('ServiceWorker registrado con éxito con el scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('El registro del ServiceWorker falló: ', err);
                });
        });
    }
});