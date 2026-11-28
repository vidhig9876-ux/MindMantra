/* Authentication functions: register, login, logout, session guard. Passwords are handled only by Firebase Auth (hashed), never stored by us. */
import { auth, db, doc, setDoc, getDoc, serverTimestamp } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, setPersistence, browserLocalPersistence }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const MSG = {
  "auth/email-already-in-use": "This email is already registered. Please log in instead.",
  "auth/invalid-email": "That email address does not look right.",
  "auth/weak-password": "Please choose a stronger password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "Network problem. Check your connection and try again.",
  "permission-denied": "You do not have permission to do that."
};
export const friendly = e => MSG[e && e.code] || "Something went wrong. Please try again.";

export async function registerStudent(f) {
  await setPersistence(auth, browserLocalPersistence);
  const cred = await createUserWithEmailAndPassword(auth, f.email.trim(), f.password);
  try {
    await updateProfile(cred.user, { displayName: f.fullName.trim() });
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid, fullName: f.fullName.trim(), email: cred.user.email,
      studentId: (f.studentId || "").trim(), college: f.college.trim(), createdAt: serverTimestamp()
    });
  } catch (err) { await cred.user.delete().catch(() => {}); throw err; } // no half-created accounts
  return cred.user;
}

export async function login(email, password) {
  await setPersistence(auth, browserLocalPersistence); // session survives refresh/close
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
  const snap = await getDoc(doc(db, "users", user.uid)).catch(() => null);
  const claims = (await user.getIdTokenResult(true)).claims;
  if (snap && !snap.exists() && !claims.admin) { // repair a missing profile
    await setDoc(doc(db, "users", user.uid), { uid: user.uid, fullName: user.displayName || "Student", email: user.email, studentId: "", college: "Not provided", createdAt: serverTimestamp() }).catch(() => {});
  }
  return { user, admin: claims.admin === true };
}

export const logout = () => signOut(auth);
export const firstName = u => ((u.displayName || u.email || "friend").split(/[ @]/)[0]);

/* Resolves with the signed-in user, otherwise sends the visitor to the login page. */
export function requireUser({ admin = false } = {}) {
  return new Promise((resolve, reject) => {
    const off = onAuthStateChanged(auth, async u => {
      off();
      if (!u) { location.replace("index.html"); return reject(new Error("signed out")); }
      if (admin) {
        const c = (await u.getIdTokenResult(true)).claims;
        if (c.admin !== true) return reject(Object.assign(new Error("not admin"), { notAdmin: true, user: u }));
      }
      resolve(u);
    });
  });
}
export { onAuthStateChanged, auth };
