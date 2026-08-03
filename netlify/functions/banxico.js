// netlify/functions/banxico.js
// Esta función se ejecuta en el servidor de Netlify (Node.js).
// Actúa como un puente (proxy) para mantener el token de Banxico oculto del navegador.

exports.handler = async function (event, context) {
  // Leemos el token seguro de las variables de entorno de Netlify
  const token = process.env.BANXICO_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Token de Banxico no configurado en el servidor de Netlify." }),
    };
  }

  try {
    // Hacemos la petición a Banxico desde el backend
    const response = await fetch(`https://www.banxico.org.mx/SieAPIRest/service/v1/series/SP1/datos?token=${token}`);
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Error al consultar la API de Banxico" }),
      };
    }

    const data = await response.json();

    // Devolvemos la data lista al frontend
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    // Si hubieran flujos de datos o sockets que cerrar explícitamente, irían aquí.
    console.log("Ejecución de la función Serverless finalizada.");
  }
};
