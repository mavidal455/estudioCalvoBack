import { Router } from "express";
import resend from "../../config/resend.js";
 

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, telefono, message, honey } = req.body;
  const soloNumeros = /^\+?[0-9]{8,15}$/;
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,60}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if(honey) return res.status(200).json({ message: "OK" });

if (!emailRegex.test(email)) {
  return res.status(400).json({ error: "Email inválido" });
}

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Campos obligatorios faltantes" });
  }
  if (message.length >= 300) {
    return res.status(400).json({ error: "El mensaje es demasiado largo" });
  }
  if (name.length > 60 || email.length >= 80) {
    return res
      .status(400)
      .json({ error: "El campo nombre o email es muy largo" });
  }
  if (telefono) {
    if (!soloNumeros.test(telefono)) {
      return res.status(400).json({ error: "Caracteres invalidos" });
    }
    if (telefono.length >= 20) {
      return res.status(400).json({ error: "El telefono es demasiado largo" });
    }
  }

  if (!soloLetras.test(name)) return res.status(400).json({ error: "Caracteres invalidos" });




  try {
    await resend.emails.send({
      from: "EstudioCalvo <onboarding@resend.dev>",
      to: process.env.GMAIL_MAIL,
      replyTo: email,
      headers: {
        'In-Reply-To': email,
      },
      subject: `Nuevo mensaje de ${name} desde el portafolio`,
      text: `
Nombre: ${name}
Email: ${email}
Telefono: ${telefono}
Mensaje: ${message}
`,
    });

    return res.status(200).json({ message: "Enviado con éxito" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "No se pudo enviar el correo" });
  }
});

export default router;