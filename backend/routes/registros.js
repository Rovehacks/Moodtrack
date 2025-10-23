const express = require('express');
const pool = require('../db'); 

const router = express.Router();

router.get('/rachas/:usuario_id', async (req, res, next) => {
    const { usuario_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT current_streak, longest_streak FROM usuarios WHERE id = $1',
            [usuario_id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

router.get('/registros/:usuario_id', async (req, res, next) => {
    const { usuario_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM registros_diarios WHERE usuario_id = $1 ORDER BY fecha DESC',
            [usuario_id]
        );
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});


router.post('/registro', async (req, res, next) => {
    const {
        usuario_id, fecha, sueno_horas, gimnasio, correr, comidas,
        trabajo_horas, escuela_horas, meditacion_min, higiene,
        interaccion_social_min, estado_animo
    } = req.body;
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        
        const userResult = await client.query(
            'SELECT current_streak, longest_streak, last_record_date FROM usuarios WHERE id = $1 FOR UPDATE',
            [usuario_id]
        );

        if (userResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        const userData = userResult.rows[0];
        const lastRecordDate = userData.last_record_date;
        let newCurrentStreak = userData.current_streak;
        let newLongestStreak = userData.longest_streak;
        let streakUpdated = false;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const lastDateOnly = lastRecordDate ? new Date(lastRecordDate) : null;
        if (lastDateOnly) {
             lastDateOnly.setHours(0, 0, 0, 0);
        }
        
        if (!lastDateOnly || lastDateOnly.getTime() < todayStart.getTime()) {
            streakUpdated = true;
            
            const yesterdayStart = new Date();
            yesterdayStart.setDate(yesterdayStart.getDate() - 1);
            yesterdayStart.setHours(0, 0, 0, 0);

            if (lastDateOnly && lastDateOnly.getTime() === yesterdayStart.getTime()) {
                newCurrentStreak += 1;
            } else {
                 newCurrentStreak = 1;
            }
        
            if (newCurrentStreak > newLongestStreak) {
                newLongestStreak = newCurrentStreak;
            }
        }
        
        const insertResult = await client.query(
            `INSERT INTO registros_diarios 
             (usuario_id, fecha, sueno_horas, gimnasio, correr, comidas, trabajo_horas, escuela_horas, meditacion_min, higiene, interaccion_social_min, estado_animo)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [usuario_id, fecha, sueno_horas, gimnasio, correr, comidas, trabajo_horas, escuela_horas, meditacion_min, higiene, interaccion_social_min, estado_animo]
        );

        if (streakUpdated) {
             await client.query(
                `UPDATE usuarios SET 
                 current_streak = $1, 
                 longest_streak = $2, 
                 last_record_date = CURRENT_DATE 
                 WHERE id = $3`,
                [newCurrentStreak, newLongestStreak, usuario_id]
            );
        }

        await client.query('COMMIT');
        res.status(201).json(insertResult.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        next(err); 
    } finally {
        client.release();
    }
});


router.put('/registro/:id', async (req, res, next) => {
    const { id } = req.params;
    const {
        sueno_horas, gimnasio, correr, comidas, trabajo_horas, escuela_horas,
        meditacion_min, higiene, interaccion_social_min, estado_animo
    } = req.body;
    try {
        const result = await pool.query(
            `UPDATE registros_diarios SET 
             sueno_horas = $1, gimnasio = $2, correr = $3, comidas = $4, trabajo_horas = $5, 
             escuela_horas = $6, meditacion_min = $7, higiene = $8, interaccion_social_min = $9, 
             estado_animo = $10
             WHERE id = $11 RETURNING *`,
            [sueno_horas, gimnasio, correr, comidas, trabajo_horas, escuela_horas, meditacion_min, higiene, interaccion_social_min, estado_animo, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Registro no encontrado." });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});


router.delete('/registro/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM registros_diarios WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Registro no encontrado." });
        }
        res.status(204).send(); 
    } catch (err) {
        next(err);
    }
});

module.exports = router;
