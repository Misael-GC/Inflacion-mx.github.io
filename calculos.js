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

let isFutureMode = false;

function onClickButtonDeflacion(){
    // Extraemos el valor del dinero (común para ambos modos)
    const Inputmoney = document.getElementById("Inputmoney");
    const rawMoneyValue = Inputmoney.value.trim();
    const moneyValue = Number(rawMoneyValue);

    if (!rawMoneyValue || isNaN(moneyValue) || moneyValue <= 0) {
        showModal("Por favor, ingresa una cantidad de dinero válida mayor a 0.");
        return;
    }

    const activeInpc = window.inpc;
    if (!activeInpc || activeInpc.length === 0) {
        showModal("Los datos de inflación no se han cargado correctamente. Por favor intenta de nuevo en unos momentos.");
        return;
    }

    if (isFutureMode) {
        // --- MODO FUTURO (Proyección) ---
        const InputAnioFuturo = document.getElementById("InputAnioFuturo");
        const rawFuture = InputAnioFuturo.value.trim();
        const futureYear = Number(rawFuture);
        
        const currentYearObj = activeInpc[activeInpc.length - 1]; 
        const currentYear = Number(currentYearObj.name);

        if (!rawFuture || isNaN(futureYear) || !Number.isInteger(futureYear)) {
            showModal("Por favor, ingresa un año futuro válido.");
            return;
        }
        
        if (futureYear <= currentYear || futureYear > 2200) {
            showModal(`Por favor, ingresa un año a futuro (mayor a ${currentYear}).`);
            return;
        }

        // Buscar el año 5 periodos atrás para el CAGR (Tasa de crecimiento anual compuesto)
        const pastYearIndex = Math.max(0, activeInpc.length - 6);
        const pastYearObj = activeInpc[pastYearIndex];
        
        const inpcRecent = currentYearObj.valor;
        const inpcPast = pastYearObj.valor;
        const yearsDiff = currentYear - Number(pastYearObj.name);

        // CAGR Formula
        const cagr = Math.pow((inpcRecent / inpcPast), (1 / yearsDiff)) - 1;
        const yearsToProject = futureYear - currentYear;
        
        // Calcular pérdida de poder adquisitivo a futuro: Dinero / (1 + CAGR)^Años
        const futurePurchasingPower = moneyValue / Math.pow((1 + cagr), yearsToProject);
        
        const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
        const futureFormatted = formatter.format(futurePurchasingPower);
        const lossPercent = ((moneyValue - futurePurchasingPower) / moneyValue * 100).toFixed(2);
        
        const resultP = document.getElementById("ResultP");
        resultP.innerHTML = `
            <div style="font-size: 1.4rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Poder Adquisitivo Proyectado (${futureYear}):</div>
            <div id="animatedResult" style="font-size: 2.8rem; font-weight: 700; color: var(--green-color); margin-bottom: 0.8rem; text-shadow: 0 0 10px rgba(153, 200, 74, 0.2);">$0.00</div>
            <div style="font-size: 1.3rem; color: var(--text-main); font-weight: 400;">Pérdida proyectada: <strong>${lossPercent}%</strong></div>
            <div style="font-size: 1.1rem; color: var(--text-muted); margin-top: 0.5rem; font-style: italic;">Basado en inflación CAGR de ${(cagr * 100).toFixed(2)}%</div>
        `;
        resultP.classList.add("show");

        const animatedResultEl = document.getElementById("animatedResult");
        if (animatedResultEl) {
            animateValue(animatedResultEl, 0, futurePurchasingPower, 1500); 
        }

        // Generar datos proyectados para la gráfica
        let projectionData = [];
        for (let i = 0; i <= yearsToProject; i++) {
            const year = currentYear + i;
            const projectedValue = moneyValue / Math.pow((1 + cagr), i);
            projectionData.push({
                name: String(year),
                valor: projectedValue 
            });
        }
        
        renderInflationChart(projectionData, currentYear, moneyValue, true);
        saveToHistory(moneyValue, currentYear, futureYear, futureFormatted + " 🔮");
        
    } else {
        // --- MODO HISTÓRICO ---
        const InputAnio = document.getElementById("InputAnio");
        const InputAnioBase = document.getElementById("InputAnioBase");
        
        const rawAnioValue = InputAnio.value.trim();
        const rawAnioBaseValue = InputAnioBase.value.trim();
        const anioValue = Number(rawAnioValue);
        const anioBaseValue = Number(rawAnioBaseValue);

        if (!rawAnioValue || !rawAnioBaseValue) {
            showModal("Por favor, llena todos los campos para poder realizar el cálculo.");
            return;
        }

        if (isNaN(anioValue) || isNaN(anioBaseValue) || !Number.isInteger(anioValue) || !Number.isInteger(anioBaseValue)) {
            showModal("Error: Ingresa únicamente años enteros válidos.");
            return;
        }

        if (anioValue < 1969 || anioValue > 2100 || anioBaseValue < 1969 || anioBaseValue > 2100) {
            showModal("Por favor ingresa años válidos (entre 1969 y la actualidad).");
            return;
        }
        
        if (anioBaseValue >= anioValue) {
            showModal("El año base debe ser estrictamente menor al año actual o más reciente.");
            return;
        }

        const userAnioBase = activeInpc.find(aniosBase => String(aniosBase.name) === String(anioBaseValue));
        if (!userAnioBase){
            showModal(`El año ${anioBaseValue} aún no está registrado.`);
            return;
        }
        const valoresBase = userAnioBase.valor;

        const userAnio = activeInpc.find(anios => String(anios.name) === String(anioValue));
        if (!userAnio){
            showModal(`El año ${anioValue} aún no está registrado.`);
            return;
        }
        
        const valores = userAnio.valor;
        const factor = valoresBase / valores;
        const valordeflactado = moneyValue * factor;
        
        const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
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

        const resultP = document.getElementById("ResultP");
        resultP.innerHTML = `
            <div style="font-size: 1.4rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">El valor equivalente es:</div>
            <div id="animatedResult" style="font-size: 2.8rem; font-weight: 700; color: var(--green-color); margin-bottom: 0.8rem; text-shadow: 0 0 10px rgba(153, 200, 74, 0.2);">$0.00</div>
            <div style="font-size: 1.3rem; color: var(--text-main); font-weight: 400;">${lossText}</div>
        `;
        resultP.classList.add("show");

        const animatedResultEl = document.getElementById("animatedResult");
        if (animatedResultEl) {
            animateValue(animatedResultEl, 0, valordeflactado, 1200);
        }

        const startYear = Math.min(anioBaseValue, anioValue);
        const endYear = Math.max(anioBaseValue, anioValue);
        
        const historicalData = activeInpc
            .filter(item => {
                const year = Number(item.name);
                return year >= startYear && year <= endYear;
            })
            .sort((a, b) => Number(a.name) - Number(b.name));
            
        renderInflationChart(historicalData, anioBaseValue, moneyValue, false);
        saveToHistory(moneyValue, anioBaseValue, anioValue, dineroDeflactadoFormateado);
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

function renderInflationChart(historicalData, anioBaseValue, moneyValue, isFuture = false) {
    const chartSection = document.getElementById('chart-section');
    const ctx = document.getElementById('inflationChart');
    
    if (!chartSection || !ctx) return;
    
    chartSection.style.display = 'block';

    if (inflationChartInstance) {
        inflationChartInstance.destroy();
    }

    const labels = historicalData.map(item => item.name);
    
    let dataPoints;
    if (isFuture) {
        // En modo futuro, los valores ya vienen calculados en 'valor'
        dataPoints = historicalData.map(item => item.valor.toFixed(2));
    } else {
        // En modo histórico, extraemos el INPC base y calculamos deflación
        const baseItem = historicalData.find(item => Number(item.name) === anioBaseValue);
        const inpcBase = baseItem ? baseItem.valor : historicalData[0].valor;

        dataPoints = historicalData.map(item => {
            const factor = inpcBase / item.valor;
            return (moneyValue * factor).toFixed(2);
        });
    }

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

    // Renderizar el historial guardado
    renderHistory();

    // Configurar Switch de Modos
    const modeToggle = document.getElementById('modeToggle');
    const labelHistorico = document.getElementById('label-historico');
    const labelFuturo = document.getElementById('label-futuro');
    const historicoInputs = document.getElementById('historico-inputs');
    const futuroInputs = document.getElementById('futuro-inputs');

    if (modeToggle) {
        modeToggle.addEventListener('change', (e) => {
            isFutureMode = e.target.checked;
            if (isFutureMode) {
                labelHistorico.classList.remove('active');
                labelFuturo.classList.add('active');
                historicoInputs.classList.add('hidden-mode');
                futuroInputs.classList.remove('hidden-mode');
                
                document.getElementById('InputAnio').removeAttribute('required');
                document.getElementById('InputAnioBase').removeAttribute('required');
                document.getElementById('InputAnioFuturo').setAttribute('required', 'true');
            } else {
                labelHistorico.classList.add('active');
                labelFuturo.classList.remove('active');
                historicoInputs.classList.remove('hidden-mode');
                futuroInputs.classList.add('hidden-mode');
                
                document.getElementById('InputAnio').setAttribute('required', 'true');
                document.getElementById('InputAnioBase').setAttribute('required', 'true');
                document.getElementById('InputAnioFuturo').removeAttribute('required');
            }
            
            // Limpiar resultados al cambiar
            const resultP = document.getElementById("ResultP");
            if(resultP) resultP.classList.remove('show');
            const chartSection = document.getElementById('chart-section');
            if(chartSection) chartSection.style.display = 'none';
        });
    }

    // Evento para borrar el historial
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }

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

// --- Lógica del Historial (LocalStorage) ---
function getHistory() {
    const history = localStorage.getItem('calcHistory');
    return history ? JSON.parse(history) : [];
}

function saveToHistory(money, anioBase, anioActual, resultFormatted) {
    const history = getHistory();
    const newEntry = {
        id: Date.now(),
        money: money,
        anioBase: anioBase,
        anioActual: anioActual,
        result: resultFormatted
    };
    
    // Insertar al inicio y mantener solo los últimos 5
    history.unshift(newEntry);
    const limitedHistory = history.slice(0, 5);
    localStorage.setItem('calcHistory', JSON.stringify(limitedHistory));
    
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    const history = getHistory();
    
    if (history.length === 0) {
        historyList.innerHTML = '<li class="history-empty">Aún no hay cálculos recientes</li>';
        return;
    }
    
    const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
    
    historyList.innerHTML = history.map(item => `
        <li class="history-item">
            <div class="history-item-details">
                <span class="history-item-money">${formatter.format(item.money)}</span>
                <span class="history-item-years">${item.anioBase} &rarr; ${item.anioActual}</span>
            </div>
            <div class="history-item-result">${item.result}</div>
        </li>
    `).join('');
}

function clearHistory() {
    localStorage.removeItem('calcHistory');
    renderHistory();
}