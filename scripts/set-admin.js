/* One-time: make an account an admin (sets the custom claim admin:true).
   Usage: node scripts/set-admin.js you@college.edu [password-if-account-must-be-created]
   Needs serviceAccountKey.json in the project root (Firebase Console > Project settings > Service accounts). Never commit that file. */
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.cert(require("../serviceAccountKey.json")) });
const [email, password] = process.argv.slice(2);
if (!email) { console.error("Usage: node scripts/set-admin.js email [password]"); process.exit(1); }
(async () => {
  let u;
  try { u = await admin.auth().getUserByEmail(email); }
  catch (e) {
    if (!password) { console.error("No such user. Re-run with a password to create the admin account."); process.exit(1); }
    u = await admin.auth().createUser({ email, password, displayName: "Admin", emailVerified: true });
  }
  await admin.auth().setCustomUserClaims(u.uid, { admin: true });
  console.log("Admin claim set for " + email + ". Log out and log in again.");
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
