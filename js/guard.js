/* Add to any page that needs login. Hides the page until the session is confirmed. */
import { requireUser, logout, firstName } from "./auth.js";
try {
  const user = await requireUser();
  window.__mmAuthOk = true;
  document.documentElement.style.visibility = "visible";
  const top = document.querySelector(".top");
  if (top) {
    const b = document.createElement("button");
    b.textContent = "Log out"; b.className = "btn ghost"; b.style.cssText = "padding:6px 12px;font-size:.75rem";
    b.onclick = () => logout().then(() => location.replace("index.html"));
    top.insertBefore(b, top.lastElementChild);
  }
  if (document.body.dataset.page === "home") { const h = document.querySelector(".top h1"); if (h) h.textContent = "Hi, " + firstName(user); }
} catch (e) { location.replace("index.html"); }
