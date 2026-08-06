import { NextResponse } from "next/server";

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

    const timestamp = new Date().toISOString();
    const senderName = isAnonymous || !name ? "Anonyme" : name.trim();
    const senderEmail = isAnonymous || !email ? "Non renseigné" : email.trim();

    console.log("----------------------------------------");
    console.log(`[NOUVEAU MESSAGE CONTACT] ${timestamp}`);
    console.log(`De: ${senderName} (${senderEmail})`);
    console.log(`Message:\n${message}`);
    console.log("----------------------------------------");

    return NextResponse.json({
      success: true,
      message: "Votre message a été transmis avec succès !",
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
