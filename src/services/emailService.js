const nodemailer = require("nodemailer");
require("dotenv").config(); // Asegurar que las variables de entorno se carguen

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Envía un correo de recuperación de contraseña.
 * @param {string} to - Correo del destinatario.
 * @param {string} subject - Asunto del correo.
 * @param {string} html - Contenido HTML del correo.
 */
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Soporte" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📩 Correo enviado a ${to}`);
    } catch (error) {
        console.error("❌ Error enviando correo:", error);
        throw new Error("Error al enviar el correo");
    }
};

module.exports = { sendEmail };
