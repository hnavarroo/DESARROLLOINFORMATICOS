const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { titulo, descripcion, categoria, prioridad, estado } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tickets (titulo, descripcion, categoria, prioridad, estado)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titulo, descripcion, categoria, prioridad, estado || 'Abierto']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, categoria, prioridad, estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tickets 
       SET titulo = COALESCE($1, titulo),
           descripcion = COALESCE($2, descripcion),
           categoria = COALESCE($3, categoria),
           prioridad = COALESCE($4, prioridad),
           estado = COALESCE($5, estado)
       WHERE id = $6 RETURNING *`,
      [titulo, descripcion, categoria, prioridad, estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }
    res.status(200).json({ mensaje: 'Ticket eliminado con éxito', ticket: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;