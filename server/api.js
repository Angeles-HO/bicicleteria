import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Global vars
const app = express();
const port = 1337;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// algo
app.use(express.static(path.join(__dirname, '../')));

// API: devuelve el JSON de productos
app.get('/api/productos', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../resources/data/bicicletas.json'), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el archivo JSON.' });
  }
});

// Init el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
