(() => {
  const API_ROOT = "api";

  async function request(path, options = {}) {
    if (window.location.protocol === "file:") {
      throw new Error("Open this app through Apache/PHP (http://...), not as a local file.");
    }

    const config = {
      method: options.method || "GET",
      credentials: "same-origin",
      headers: {},
    };

    if (options.body !== undefined) {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(options.body);
    }

    let response;
    try {
      response = await fetch(`${API_ROOT}/${path}`, config);
    } catch (error) {
      throw new Error("Cannot reach PHP API. Start Apache/PHP server and open via http://localhost/...");
    }

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json() : {};

    if (!response.ok || payload.ok === false) {
      const message = payload.message || "Request failed.";
      const error = new Error(message);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  }

  function money(value) {
    return `PHP ${Number(value).toFixed(2)}`;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function rolePage(role) {
    return role === "staff" ? "staff.html" : "student.html";
  }

  function formatDateTime(value) {
    const normalized = String(value || "").replace(" ", "T");
    const parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) {
      return String(value || "");
    }

    return parsed.toLocaleString();
  }

  window.CanteenAPI = {
    request,
    money,
    escapeHtml,
    rolePage,
    formatDateTime,
  };
})();
