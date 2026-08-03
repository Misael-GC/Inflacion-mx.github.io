const translations = {
    es: {
        title_main: "Inflación en México",
        subtitle_main: "Calcula el efecto de la inflación en el poder adquisitivo del dinero",
        warning_part1: "Advertencia: el calculo es anual, es decir, de ",
        warning_part2: " de cada año.",
        period_text: "Periodo disponible es al ultimo mes que Banxico ha publicado, por lo normal es un mes de atraso al actual mes",
        source_text: "Fuente: INEGI",
        history_title: "Cálculos Recientes",
        history_empty: "Aún no hay cálculos recientes",
        mode_historic: "Histórico",
        mode_future: "Proyección 🔮",
        label_money: "Escribe el valor de tu dinero",
        label_year_current: "Escribe el Año actual o más reciente,",
        label_year_base: "Elige un año base",
        label_year_future: "Año a proyectar (Ej. 2035)",
        btn_calculate: "Calcular",
        instr_current: "Año actual o más reciente: es el numerador, es mayor al año base",
        instr_base: "Año base: es el denominador, es menor al año actual o más reciente",
        btn_download: " Guardar Imagen",
        
        // Modals & Alerts
        err_fill_fields: "Por favor, llena todos los campos para poder realizar el cálculo.",
        err_valid_integers: "Error: Ingresa únicamente años enteros válidos.",
        err_valid_years: "Por favor ingresa años válidos (entre 1969 y la actualidad).",
        err_valid_years_future: "Por favor ingresa un año futuro válido (mayor al actual y hasta 2200).",
        err_base_less: "El año base debe ser estrictamente menor al año actual o más reciente.",
        err_not_registered: "aún no está registrado.",
        err_no_share: "Tu navegador o dispositivo no soporta la función de compartir nativa.",
        
        // Share Modal
        share_title: "Comparte tu resultado",
        share_desc: "Copia el siguiente texto para enviarlo por WhatsApp o publicarlo en tus redes:",
        share_btn_copy: " Copiar Texto",
        share_btn_close: "Cerrar",
        share_copied: " ¡Copiado!",
        
        // Results HTML
        res_equivalent: "El valor equivalente es:",
        res_loss: "Pérdida de poder adquisitivo:",
        res_gain: "Ganancia de poder adquisitivo:",
        res_no_change: "Sin cambios en el poder adquisitivo",
        res_future_pow: "Poder Adquisitivo Proyectado",
        res_future_loss: "Pérdida proyectada:",
        res_based_on: "Basado en inflación CAGR de",
        btn_share_historic: " Compartir Resultado",
        btn_share_future: " Compartir Proyección",
        share_msg_historic: "pesos del año",
        share_msg_historic2: "equivaldrían a",
        share_msg_historic3: "Calcula la inflación de tu dinero en:",
        share_msg_future: "pesos de hoy valdrán solo",
        share_msg_future2: "en el año",
        share_msg_future3: "debido a la inflación! Calcula la proyección de tu dinero en:",
        
        // Months
        enero: "Ene",
        febrero: "Feb",
        marzo: "Mar",
        abril: "Abril",
        mayo: "Mayo",
        junio: "Jun",
        julio: "Jul",
        agosto: "Ago",
        septiembre: "Sep",
        octubre: "Oct",
        noviembre: "Nov",
        diciembre: "Dic",
        enero_full: "Enero",
        febrero_full: "Febrero",
        marzo_full: "Marzo",
        abril_full: "Abril",
        mayo_full: "Mayo",
        junio_full: "Junio",
        julio_full: "Julio",
        agosto_full: "Agosto",
        septiembre_full: "Septiembre",
        octubre_full: "Octubre",
        noviembre_full: "Noviembre",
        diciembre_full: "Diciembre"
    },
    en: {
        title_main: "Inflation in Mexico",
        subtitle_main: "Calculate the effect of inflation on money's purchasing power",
        warning_part1: "Warning: the calculation is annual, meaning from ",
        warning_part2: " of each year.",
        period_text: "Available period is up to the last month Banxico has published, usually one month behind the current month",
        source_text: "Source: INEGI",
        history_title: "Recent Calculations",
        history_empty: "No recent calculations yet",
        mode_historic: "Historic",
        mode_future: "Projection 🔮",
        label_money: "Enter the amount of money",
        label_year_current: "Enter the current or most recent year",
        label_year_base: "Choose a base year",
        label_year_future: "Year to project (E.g. 2035)",
        btn_calculate: "Calculate",
        instr_current: "Current or most recent year: it is the numerator, it is greater than the base year",
        instr_base: "Base year: it is the denominator, it is less than the current or most recent year",
        btn_download: " Save Image",
        
        // Modals & Alerts
        err_fill_fields: "Please fill in all fields to perform the calculation.",
        err_valid_integers: "Error: Enter only valid integer years.",
        err_valid_years: "Please enter valid years (between 1969 and today).",
        err_valid_years_future: "Please enter a valid future year (greater than current and up to 2200).",
        err_base_less: "The base year must be strictly less than the current or most recent year.",
        err_not_registered: "is not registered yet.",
        err_no_share: "Your browser or device does not support the native share function.",
        
        // Share Modal
        share_title: "Share your result",
        share_desc: "Copy the following text to send it via WhatsApp or post on your social networks:",
        share_btn_copy: " Copy Text",
        share_btn_close: "Close",
        share_copied: " Copied!",
        
        // Results HTML
        res_equivalent: "The equivalent value is:",
        res_loss: "Purchasing power loss:",
        res_gain: "Purchasing power gain:",
        res_no_change: "No change in purchasing power",
        res_future_pow: "Projected Purchasing Power",
        res_future_loss: "Projected loss:",
        res_based_on: "Based on a CAGR inflation of",
        btn_share_historic: " Share Result",
        btn_share_future: " Share Projection",
        share_msg_historic: "pesos from the year",
        share_msg_historic2: "would be equivalent to",
        share_msg_historic3: "Calculate the inflation of your money at:",
        share_msg_future: "pesos today will only be worth",
        share_msg_future2: "in the year",
        share_msg_future3: "due to inflation! Calculate your money's projection at:",

        // Months
        enero: "Jan",
        febrero: "Feb",
        marzo: "Mar",
        abril: "Apr",
        mayo: "May",
        junio: "Jun",
        julio: "Jul",
        agosto: "Aug",
        septiembre: "Sep",
        octubre: "Oct",
        noviembre: "Nov",
        diciembre: "Dec",
        enero_full: "January",
        febrero_full: "February",
        marzo_full: "March",
        abril_full: "April",
        mayo_full: "May",
        junio_full: "June",
        julio_full: "July",
        agosto_full: "August",
        septiembre_full: "September",
        octubre_full: "October",
        noviembre_full: "November",
        diciembre_full: "December"
    }
};

// Global variables
let currentLang = localStorage.getItem('appLanguage') || 'es';

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('appLanguage', lang);
    document.documentElement.lang = lang; // Update HTML lang attribute
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update all static text marked with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            // Check if element has inner HTML icons like <i class="..."></i>
            const icon = el.querySelector('i');
            if (icon) {
                // If it has an icon, preserve it and replace only the text node
                // Note: this simple approach assumes the icon is first.
                el.innerHTML = icon.outerHTML + (key === 'btn_download' || key.includes('share') ? '' : ' ') + translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    // Update dynamic month labels
    const activeMonthText = document.getElementById("active-month-text");
    if (activeMonthText && typeof window.currentSelectedMonth === 'string') {
        const monthKey = window.currentSelectedMonth + '_full';
        if(translations[lang][monthKey]){
            activeMonthText.innerText = translations[lang][monthKey];
        }
    }
    
    const warningPart1 = document.getElementById("warning-part1");
    if (warningPart1) warningPart1.innerText = translations[lang]["warning_part1"];
    
    const warningPart2 = document.getElementById("warning-part2");
    if (warningPart2) warningPart2.innerText = translations[lang]["warning_part2"];

    // Update placeholders
    const inputMoney = document.getElementById("Inputmoney");
    if (inputMoney && lang === 'en') inputMoney.placeholder = "100";
    
    const inputAnio = document.getElementById("InputAnio");
    if (inputAnio && lang === 'en') inputAnio.placeholder = "2023";
    
    const inputAnioBase = document.getElementById("InputAnioBase");
    if (inputAnioBase && lang === 'en') inputAnioBase.placeholder = "2000";
    
    const inputAnioFuturo = document.getElementById("InputAnioFuturo");
    if (inputAnioFuturo && lang === 'en') inputAnioFuturo.placeholder = "2035";

    // Trigger history re-render to translate UI
    if (typeof renderHistory === 'function') {
        renderHistory();
    }
}

function t(key) {
    return translations[currentLang][key] || key;
}

// On DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    
    // Attach listeners to language toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.currentTarget.dataset.lang;
            setLanguage(lang);
            
            // Re-render chart if it exists
            if (window.inflationChartInstance) {
                // To translate chart labels, just trigger a recalculate click if we are showing results
                const resultP = document.getElementById("ResultP");
                if (resultP && resultP.classList.contains("show")) {
                    if (typeof onClickButtonDeflacion === 'function') {
                        onClickButtonDeflacion();
                    }
                }
            }
        });
    });
});
