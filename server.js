
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// Datos temporales para realizar las pruebas
const usuarios = [];
const vehiculos = [
    {
        id: 1,
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: 2024,
        precio: 85000000
    },
    {
        id: 2,
        marca: 'Chevrolet',
        modelo: 'Onix',
        anio: 2023,
        precio: 62000000
    }
];

// REGISTRAR USUARIO
app.post('/api/usuarios/registro', (req, res) => {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
        return res.status(400).json({
            mensaje: 'Debe ingresar usuario y contraseña.'
        });
    }

    const existe = usuarios.find(u => u.usuario === usuario);

    if (existe) {
        return res.status(409).json({
            mensaje: 'El usuario ya existe.'
        });
    }

    usuarios.push({ usuario, contraseña });

    res.status(201).json({
        mensaje: 'Usuario registrado correctamente.'
    });
});

// INICIAR SESIÓN
app.post('/api/usuarios/login', (req, res) => {
    const { usuario, contraseña } = req.body;

    const encontrado = usuarios.find(
        u => u.usuario === usuario &&
             u.contraseña === contraseña
    );

    if (!encontrado) {
        return res.status(401).json({
            mensaje: 'Credenciales incorrectas.'
        });
    }

    res.status(200).json({
        mensaje: 'Inicio de sesión exitoso.'
    });
});

// CONSULTAR TODOS LOS VEHÍCULOS
app.get('/api/vehiculos', (req, res) => {
    res.status(200).json(vehiculos);
});

// CONSULTAR UN VEHÍCULO POR ID
app.get('/api/vehiculos/:id', (req, res) => {
    const id = Number(req.params.id);
    const vehiculo = vehiculos.find(v => v.id === id);

    if (!vehiculo) {
        return res.status(404).json({
            mensaje: 'Vehículo no encontrado.'
        });
    }

    res.status(200).json(vehiculo);
});

// REGISTRAR VEHÍCULO
app.post('/api/vehiculos', (req, res) => {
    const { marca, modelo, anio, precio } = req.body;

    if (!marca || !modelo || !anio || !precio) {
        return res.status(400).json({
            mensaje: 'Debe ingresar marca, modelo, año y precio.'
        });
    }

    const nuevoVehiculo = {
        id: vehiculos.length
            ? Math.max(...vehiculos.map(v => v.id)) + 1
            : 1,
        marca,
        modelo,
        anio: Number(anio),
        precio: Number(precio)
    };

    vehiculos.push(nuevoVehiculo);

    res.status(201).json({
        mensaje: 'Vehículo registrado correctamente.',
        vehiculo: nuevoVehiculo
    });
});

// ACTUALIZAR VEHÍCULO
app.put('/api/vehiculos/:id', (req, res) => {
    const id = Number(req.params.id);
    const indice = vehiculos.findIndex(v => v.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Vehículo no encontrado.'
        });
    }

    const { marca, modelo, anio, precio } = req.body;

    if (!marca || !modelo || !anio || !precio) {
        return res.status(400).json({
            mensaje: 'Debe ingresar marca, modelo, año y precio.'
        });
    }

    vehiculos[indice] = {
        id,
        marca,
        modelo,
        anio: Number(anio),
        precio: Number(precio)
    };

    res.status(200).json({
        mensaje: 'Vehículo actualizado correctamente.',
        vehiculo: vehiculos[indice]
    });
});

// ELIMINAR VEHÍCULO
app.delete('/api/vehiculos/:id', (req, res) => {
    const id = Number(req.params.id);
    const indice = vehiculos.findIndex(v => v.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Vehículo no encontrado.'
        });
    }

    vehiculos.splice(indice, 1);

    res.status(200).json({
        mensaje: 'Vehículo eliminado correctamente.'
    });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`API del concesionario ejecutándose en http://localhost:${PORT}`);
});
