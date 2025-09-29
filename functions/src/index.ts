
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Configure Nodemailer with your email service provider
// We are using Gmail here. 
// IMPORTANT: You need to set these as environment variables in your Cloud Function
// command to set: firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="your-app-password"
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// This is the email address where the feedback will be sent to.
const ADMIN_EMAIL = "cuentasclaras.software@gmail.com";

// Cloud Function that triggers when a new document is created in the 'feedback' collection
export const sendFeedbackEmail = functions.firestore
    .document("feedback/{feedbackId}")
    .onCreate(async (snap) => {
      const feedback = snap.data();

      const mailOptions = {
        from: `"Cuentas Claras App" <${gmailEmail}>`,
        to: ADMIN_EMAIL,
        subject: `Nuevo Feedback: ${feedback.subject}`,
        html: `
          <h1>Nuevo mensaje de feedback</h1>
          <p><strong>De:</strong> ${feedback.userEmail}</p>
          <p><strong>Asunto:</strong> ${feedback.subject}</p>
          <hr>
          <p><strong>Mensaje:</strong></p>
          <p>${feedback.message}</p>
          <hr>
          <p><strong>ID de Negocio:</strong> ${feedback.businessId}</p>
        `,
      };

      try {
        await mailTransport.sendMail(mailOptions);
        functions.logger.log("Email enviado con éxito a:", ADMIN_EMAIL);
      } catch (error) {
        functions.logger.error(
            "Hubo un error al enviar el email:",
            error
        );
      }
    });

// Scheduled function to clean up old audit logs
export const cleanupOldAuditLogs = functions.pubsub
    .schedule("every 24 hours") // Runs once a day
    .onRun(async (context) => {
      const now = admin.firestore.Timestamp.now();
      const twoDaysAgo = new admin.firestore.Timestamp(
          now.seconds - 48 * 60 * 60, // 48 hours in seconds
          now.nanoseconds
      );

      const auditLogsRef = admin.firestore().collection("auditLogs");
      const oldLogsQuery = auditLogsRef.where("timestamp", "<=", twoDaysAgo);

      try {
        const snapshot = await oldLogsQuery.get();
        if (snapshot.empty) {
          functions.logger.log("No hay registros de auditoría antiguos para eliminar.");
          return null;
        }

        const batch = admin.firestore().batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        functions.logger.log(`Se eliminaron ${snapshot.size} registros de auditoría antiguos.`);
        return null;
      } catch (error) {
        functions.logger.error("Error al limpiar los registros de auditoría antiguos:", error);
        return null;
      }
    });
