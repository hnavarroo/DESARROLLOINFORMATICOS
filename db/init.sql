-- Creación de la tabla de tickets para la API de Help Desk
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba iniciales (Opcional, para tener registros al probar la API)
INSERT INTO tickets (titulo, descripcion, estado) VALUES
('Error en pantalla de inicio', 'No carga el panel principal al iniciar sesión', 'pendiente'),
('Solicitud de monitor', 'El usuario requiere un segundo monitor para diseño', 'en proceso');