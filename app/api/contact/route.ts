import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, isAnonymous } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Le message ne peut pas être vide." },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString("fr-BE", { timeZone: "Europe/Brussels" });
    const senderName = isAnonymous || !name ? "Visiteur / Anonyme" : name.trim();
    const senderEmail = isAnonymous || !email ? "Non renseigné" : email.trim();

    const formattedLog = `\n========================================\n📅 Date: ${timestamp}\n👤 De: ${senderName}\n📧 Email: ${senderEmail}\n💬 Message:\n${message.trim()}\n========================================\n`;

    // 1. Console log pour le serveur
    console.log(formattedLog);

    // 2. Sauvegarde dans un fichier journal local privé (messages.log)
    try {
      const logFilePath = path.join(process.cwd(), "messages.log");
      fs.appendFileSync(logFilePath, formattedLog, "utf-8");
    } catch (fsErr) {
      console.error("Erreur sauvegarde fichier local messages.log:", fsErr);
    }

    return NextResponse.json({
      success: true,
      message: "Votre message a été transmis et sauvegardé avec succès !",
      timestamp,
    });
  } catch (err) {
    console.error("Erreur API Contact:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
