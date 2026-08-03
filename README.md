# 📉 Calculadora de Inflación en México

Una aplicación web interactiva que permite a los usuarios calcular el efecto de la inflación en el poder adquisitivo del dinero en México a través del tiempo, utilizando datos oficiales del Índice Nacional de Precios al Consumidor (INPC).

## ✨ Características Principales
* **Cálculo Preciso**: Calcula la pérdida o ganancia de poder adquisitivo entre dos años (un año base y un año reciente) basado en los índices de un mes en específico.
* **Integración API en Tiempo Real**: Consume los datos oficiales de inflación del Banco de México (Banxico) a través de un puente seguro en el servidor (Serverless Proxy).
* **Mecanismo de Respaldo Inteligente (Fallback)**: Si la API de Banxico llega a fallar o no responde, la aplicación carga automáticamente un set de datos históricos estáticos locales, garantizando que el usuario nunca vea la app rota.
* **Modo Oscuro / Claro**: Interfaz moderna y dinámica que respeta tu preferencia de visualización guardándola localmente.
* **Arquitectura Limpia**: Código construido sobre principios SOLID utilizando únicamente Vanilla JavaScript, logrando un proyecto sumamente ligero y mantenible.

## 💡 ¿Por qué es importante esta herramienta? (El valor que otorga)

* **Pérdida real del poder adquisitivo:** Te indica exactamente cuánto rendimiento mínimo anual acumulado debió generar tu dinero o tus inversiones para no perder valor frente a la inflación en un horizonte histórico o proyectado a 5 años.
* **Ajustes de contratos a largo plazo:** Es la herramienta matemática adecuada para calcular incrementos en rentas, precios de servicios o presupuestos plurianuales considerando el interés compuesto de la inflación.
* **Análisis de Ingresos (Modo Histórico):** Te permite descubrir si tu sueldo o tus ganancias realmente crecieron con el paso de los años, o si en realidad perdiste poder adquisitivo frente al encarecimiento de la vida. Es un argumento sólido para negociar aumentos salariales.
* **Proyección y Concientización Financiera:** Al usar su Modo Futuro (basado en la Tasa de Crecimiento Anual Compuesto o CAGR), ayuda al usuario a visualizar cómo se "derrite" el dinero inactivo y fomenta la educación financiera.

## 🚀 Arquitectura
El proyecto es una **Single Page Application (SPA)** nativa que no requiere frameworks pesados. Todo está manejado con **HTML semántico, CSS moderno y JavaScript**.

Para asegurar la comunicación con Banxico, utilizamos **Netlify Functions** (Backend Serverless). Esto nos permite realizar peticiones sin exponer ningún token de seguridad en el código fuente que llega al usuario. Puedes encontrar la explicación detallada de esta arquitectura en [`DOCUMENTACION_NETLIFY.md`](./DOCUMENTACION_NETLIFY.md).

## 🛠 Instalación y Configuración Local

Sigue estos pasos para correr y modificar la aplicación en tu propia computadora:

### 1. Clonar el repositorio
```bash
git clone https://github.com/Misael-GC/Inflacion-mx.github.io.git
cd Inflacion-mx.github.io
```

### 2. Configurar la Variable de Entorno
Para conectarte a Banxico, necesitas un Token de su [API SIE](https://www.banxico.org.mx/SieAPIRest/service/v1/doc/catalogoSeries).
1. En la carpeta de tu proyecto, crea un archivo llamado `.env` (asegúrate de no subirlo a tu repositorio).
2. Agrega tu token de la siguiente manera:
   ```env
   BANXICO_TOKEN=tu_token_aqui_sin_comillas
   ```

### 3. Levantar el Servidor de Desarrollo
Debido a que usamos funciones de backend (Serverless), no basta con usar extensiones como *Live Server*. Necesitas correr el simulador de Netlify.

Si utilizas `pnpm`, ejecuta en tu terminal:
```bash
pnpm dlx netlify-cli dev
```
*(También puedes usar `npx netlify-cli dev` si usas npm).*

Netlify CLI descargará las herramientas necesarias, leerá tu token, compilará la función y levantará un servidor local (por ejemplo: `http://localhost:8888`). ¡Abre ese enlace y listo!

## 🌐 Despliegue en Producción
La aplicación está preparada para ser hospedada en **Netlify**. Solo tienes que conectar tu repositorio de GitHub, y recordar ir al apartado de *Site settings > Environment variables* para agregar tu `BANXICO_TOKEN`. El servidor hará el resto.

## 👨‍💻 Creador
**Misael Gomez Cuautle**
- [GitHub](https://github.com/Misael-GC)
- [LinkedIn](https://www.linkedin.com/in/misael-g%C3%B3mez-cuautle-5976491b9/)
- [Portafolio](https://misael-gomez-cuautle.super.site/portafolio)

## 📄 Licencia
Este proyecto es de código abierto bajo la Licencia MIT.
