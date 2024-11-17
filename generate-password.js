// generate-password.js
const bcryptjs = require('bcryptjs');

// Contraseña que deseas usar
const password = 'Gearsofware1997-rio_lui05';

async function generateHash() {
    try {
        const hash = await bcryptjs.hash(password, 12);
        console.log('Tu hash de contraseña es:');
        console.log(hash);
        console.log('\nCópialo y pégalo en la variable ADMIN_PASSWORD_HASH de tu .env.production');
    } catch (error) {
        console.error('Error al generar el hash:', error);
    }
}

generateHash();