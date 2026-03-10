const express = require('express');
const Unblocker = require('unblocker');

const app = express();

// Aquesta és la màgia: unblocker interceptarà les peticions i reescriurà la web
const unblocker = new Unblocker({ prefix: '/proxy/' });
app.use(unblocker);

// =============================================
// RUTA ESPECIAL: YouTube -> Invidious
// Quan algú escriu una URL de YouTube, el redirigim
// a un frontend alternatiu lleuger que SÍ funciona pel proxy.
// =============================================
app.get('/yt', (req, res) => {
    const query = req.query.q || '';
    if (query) {
        // Si l'usuari ha buscat alguna cosa, redirigim a la cerca d'Invidious
        res.redirect('/proxy/https://yewtu.be/search?q=' + encodeURIComponent(query));
    } else {
        res.redirect('/proxy/https://yewtu.be/');
    }
});

// Ruta per veure un vídeo concret
app.get('/video/:id', (req, res) => {
    res.redirect('/proxy/https://yewtu.be/watch?v=' + req.params.id);
});

// La pàgina d'inici amb botons d'accés directe
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ca">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Navegador Magic</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .container { 
                    background: rgba(255,255,255,0.05);
                    backdrop-filter: blur(10px);
                    padding: 40px; 
                    border-radius: 20px; 
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5); 
                    text-align: center;
                    width: 90%;
                    max-width: 550px;
                }
                h1 { 
                    margin-bottom: 8px; 
                    font-size: 2.2em;
                    background: linear-gradient(90deg, #8ab4f8, #c084fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .subtitle {
                    color: rgba(255,255,255,0.5);
                    margin-bottom: 30px;
                    font-size: 0.9em;
                }
                input { 
                    padding: 15px; 
                    width: 100%; 
                    margin-bottom: 15px; 
                    border: 1px solid rgba(255,255,255,0.15); 
                    border-radius: 12px; 
                    font-size: 16px;
                    background: rgba(255,255,255,0.07);
                    color: white;
                    transition: all 0.3s;
                }
                input:focus { 
                    outline: none;
                    border-color: #8ab4f8;
                    box-shadow: 0 0 20px rgba(138,180,248,0.2);
                }
                input::placeholder { color: rgba(255,255,255,0.3); }
                .btn { 
                    padding: 13px 30px; 
                    border: none; 
                    border-radius: 12px; 
                    cursor: pointer; 
                    font-size: 15px;
                    font-weight: 600;
                    transition: all 0.3s;
                    display: inline-block;
                    text-decoration: none;
                    margin: 5px;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #8ab4f8, #6d9cf8);
                    color: #0f0c29;
                    width: 100%;
                }
                .btn-primary:hover { 
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(138,180,248,0.3);
                }
                .divider {
                    border-top: 1px solid rgba(255,255,255,0.1);
                    margin: 25px 0;
                }
                .shortcuts {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                .btn-yt { 
                    background: linear-gradient(135deg, #ff4444, #cc0000);
                    color: white;
                }
                .btn-yt:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255,68,68,0.3);
                }
                .btn-wiki { 
                    background: linear-gradient(135deg, #4CAF50, #2E7D32);
                    color: white;
                }
                .btn-wiki:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(76,175,80,0.3);
                }
                .btn-reddit { 
                    background: linear-gradient(135deg, #FF5722, #E64A19);
                    color: white;
                }
                .btn-reddit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255,87,34,0.3);
                }
                .btn-search { 
                    background: linear-gradient(135deg, #c084fc, #9333ea);
                    color: white;
                }
                .btn-search:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(192,132,252,0.3);
                }
                .yt-section {
                    margin-top: 20px;
                    padding: 20px;
                    background: rgba(255,68,68,0.08);
                    border-radius: 12px;
                    border: 1px solid rgba(255,68,68,0.2);
                }
                .yt-section h3 {
                    color: #ff6666;
                    margin-bottom: 12px;
                    font-size: 1.1em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Navegador Magic</h1>
                <p class="subtitle">Navega lliurement per internet</p>
                
                <!-- Barra principal -->
                <form onsubmit="event.preventDefault(); let u = document.getElementById('url').value; if(!u.startsWith('http')) u = 'https://' + u; window.location.href = '/proxy/' + u;">
                    <input type="text" id="url" placeholder="Escriu una URL (ex: wikipedia.org)" required>
                    <button type="submit" class="btn btn-primary">Ves-hi</button>
                </form>

                <div class="divider"></div>

                <!-- Accessos directes -->
                <div class="shortcuts">
                    <a href="/proxy/https://vid.puffyan.us/" class="btn btn-yt">YouTube</a>
                    <a href="/proxy/https://ca.wikipedia.org/" class="btn btn-wiki">Viquipèdia</a>
                    <a href="/proxy/https://old.reddit.com/" class="btn btn-reddit">Reddit</a>
                    <a href="/proxy/https://duckduckgo.com/" class="btn btn-search">DuckDuckGo</a>
                </div>

                <!-- Secció especial YouTube -->
                <div class="yt-section">
                    <h3>Cerca a YouTube</h3>
                    <form onsubmit="event.preventDefault(); window.location.href = '/yt?q=' + encodeURIComponent(document.getElementById('ytsearch').value);">
                        <input type="text" id="ytsearch" placeholder="Busca vídeos de YouTube...">
                        <button type="submit" class="btn btn-yt" style="width:100%;">Buscar Vídeos</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Escoltem al port que ens doni el servidor, o el 8080 en local
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('[+] El Proxy està funcionant. Obre http://localhost:' + port + ' al teu navegador.');
})