const express = require('express');
const Unblocker = require('unblocker');

const app = express();

// Aquesta és la màgia: unblocker interceptarà les peticions i reescriurà la web
const unblocker = new Unblocker({ prefix: '/proxy/' });
app.use(unblocker);

// La pàgina d'inici que veuràs tu (una barra de cerca senzilla)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ca">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cercador Lliure</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    background-color: #202124; 
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container { 
                    background: #282a2d; 
                    padding: 40px; 
                    border-radius: 12px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
                    text-align: center;
                    width: 100%;
                    max-width: 500px;
                }
                h1 { margin-bottom: 30px; font-size: 2em; }
                input { 
                    padding: 15px; 
                    width: 80%; 
                    margin-bottom: 20px; 
                    border: none; 
                    border-radius: 8px; 
                    font-size: 16px;
                    background: #3c4043;
                    color: white;
                }
                input:focus { outline: 2px solid #8ab4f8; }
                button { 
                    padding: 12px 25px; 
                    background-color: #8ab4f8; 
                    color: #202124; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer; 
                    font-size: 16px;
                    font-weight: bold;
                    transition: all 0.2s;
                }
                button:hover { background-color: #aecbfa; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Navegador</h1>
                <!-- El formulari redirigeix la URL introduïda afegint-hi el prefix /proxy/ -->
                <form onsubmit="event.preventDefault(); window.location.href = '/proxy/' + document.getElementById('url').value;">
                    <input type="text" id="url" placeholder="Exemple: https://ca.wikipedia.org" required>
                    <br>
                    <button type="submit">Ves-hi</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// Escoltem al port que ens doni el servidor, o el 8080 en local
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(\`[+] El Proxy està funcionant. Obre http://localhost:\${port} al teu navegador.\`);
})