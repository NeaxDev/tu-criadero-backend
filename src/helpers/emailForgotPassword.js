import nodemailer from "nodemailer";

export const emailForgotPassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token, lastname } = data;

  const info = await transport.sendMail({
    from: "Tu Criadero",
    to: email,
    subject: "Restablece tu contraseña",
    text: "Restablece tu contraseña",
    html: `<p>Hola ${name} ${lastname}, has solicitado restablecer tu contraseña</p>
        <p>Sigue el siguiente enlace para generar una nueva contraseña: 
            <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Restablecer contraseña</a>
        </p>

        <p>Si tu no solicitastes el cambio de contraseña de esta cuenta, puedes ignorar este mensaje</p>`,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};
