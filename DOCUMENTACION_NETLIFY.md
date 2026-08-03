# 🚀 Documentación: Despliegue Seguro con Netlify Functions

Esta documentación explica la arquitectura implementada en el proyecto para consumir la API de Banxico de manera segura, ocultando el token de acceso mediante **Netlify Functions** (Serverless).

## 🛑 El Problema Original
Las aplicaciones Frontend estáticas (solo HTML/CSS/JS) se ejecutan directamente en el navegador de los usuarios (Google Chrome, Safari, etc.). 
Si hacemos la petición HTTP (usando `fetch()`) a la API de Banxico directamente desde nuestro archivo `calculos.js`, estamos obligados a exponer nuestro token secreto de Banxico en el código fuente (o en la URL de la petición). 

Cualquier persona podría abrir la pestaña **Network (Red)** de las herramientas de desarrollador en su navegador y copiarnos el token.

## ✅ La Solución: Netlify Functions (Serverless Proxy)
Para evitar exponer el token, implementamos una **función de backend** (Serverless Function) utilizando la infraestructura gratuita de Netlify. 

El flujo de información ahora funciona de esta manera:
1. **Tu navegador (Frontend)** le hace una petición limpia (sin token) a tu función de Netlify (`/.netlify/functions/banxico`).
2. **Netlify (Backend)** recibe la petición, lee de forma segura tu token desde las **variables de entorno (`.env` o Secrets)** y realiza la petición a Banxico por ti.
3. **Netlify** recibe los datos de Banxico, los empaqueta y se los regresa a tu frontend.
4. El navegador del usuario final jamás se entera de la existencia del token.

## 📁 Archivos Clave
* `netlify.toml`: Le indica a los servidores de Netlify en qué carpeta buscar tus funciones Serverless.
* `netlify/functions/banxico.js`: Es el código de Node.js que sirve como puente/proxy entre tu frontend y Banxico.
* `config.js`: Contiene la variable global `API_BANXICO_URL` apuntando a tu función local en lugar de la URL original de Banxico.
* `.env` (Ignorado por Git): Un archivo exclusivamente para tu computadora local donde guardas tu token real para hacer pruebas.

---

## 💻 Comandos y Guía de Uso Local

Para probar esta arquitectura en tu propia computadora, no puedes usar un simple *Live Server* (ya que este no entiende qué es un backend de Node.js ni cómo procesar la función de Netlify). Para ello, usamos **Netlify CLI**.

### 1. Variables de Entorno (Local)
Asegúrate de tener un archivo llamado `.env` en la raíz de tu proyecto (y que esté dentro de tu `.gitignore` para no subirlo a GitHub) con el siguiente contenido:
```env
BANXICO_TOKEN=tu_token_largo_aqui
```

### 2. Levantar el Servidor de Pruebas
Puedes ejecutar el entorno de Netlify sin necesidad de instalarlo globalmente usando `pnpm dlx` (o `npx`). 

Abre tu terminal (en la raíz de tu proyecto) y ejecuta:
```bash
pnpm dlx netlify-cli dev
```

Este comando hace toda la magia por detrás:
- Descarga temporalmente las herramientas de Netlify.
- Lee automáticamente tu archivo `.env`.
- Levanta un servidor en tu computadora (típicamente en `http://localhost:8888`).
- Ejecuta y simula tu backend proxy para que funcione exactamente igual que en producción.

---

## 🌐 Configuración en Producción (Panel de Netlify)

Una vez que subas tu código a GitHub y vincules tu repositorio a Netlify, debes proveer tu token a los servidores de Netlify para que puedan inyectarlo en tu función Serverless (ya que no vas a subir el `.env`).

1. Ve al panel de control de tu proyecto en **Netlify**.
2. Navega a **Site configuration** > **Environment variables**.
3. Haz clic en **Add a variable** > **Add a single variable**.
4. Escribe `BANXICO_TOKEN` como **Key** y pega tu token real como **Value**.
5. Dispara un nuevo despliegue (Deploy) para que la función tome los cambios de entorno.

> **Mejores Prácticas:** Al usar Netlify Functions, tienes una arquitectura escalable. A futuro podrías agregar caché en tu servidor de Netlify, registrar analíticas de uso, o consumir múltiples APIs de diferentes fuentes y unirlas en una sola respuesta más liviana para tu cliente.
