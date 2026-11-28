/* Pure form-validation helpers (no Firebase). Easy to explain in a viva. */
export const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e || "");
export function validateRegistration(f) {
  const e = [];
  if ((f.fullName || "").trim().length < 2) e.push("Please enter your full name.");
  if (!isEmail(f.email)) e.push("Please enter a valid college email.");
  if ((f.college || "").trim().length < 2) e.push("Please enter your college name.");
  if (f.studentId && !/^[A-Za-z0-9\-\/]{3,40}$/.test(f.studentId.trim())) e.push("Student ID may only contain letters, numbers, - and / (3-40 characters).");
  if (!f.password || f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) e.push("Password needs 8+ characters with at least one letter and one number.");
  if (f.password !== f.confirm) e.push("Passwords do not match.");
  return e;
}
