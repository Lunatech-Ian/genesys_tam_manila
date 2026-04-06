let currentUser = null;
let currentConfig = {
  firstName: "",
  lastName: "",
  organization: ""
};

const userSelect = document.getElementById("userSelect");
const activeUserEl = document.getElementById("activeUser");
const debugLog = document.getElementById("debugLog");

const cfgFirstName = document.getElementById("cfgFirstName");
const cfgLastName = document.getElementById("cfgLastName");
const cfgOrganization = document.getElementById("cfgOrganization");
const cfgDummyUser = document.getElementById("cfgDummyUser");

const configModal = document.getElementById("configModal");
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const organizationInput = document.getElementById("organizationInput");

window.onload = () => {
  loadUsers();
  loadSavedConfiguration();
  loadSavedUser();
  log("Page loaded");
};

function loadUsers() {
  Object.keys(USERS).forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    userSelect.appendChild(option);
  });
}

function loadSavedConfiguration() {
  const savedConfig = localStorage.getItem("messengerConfig");

  if (savedConfig) {
    currentConfig = JSON.parse(savedConfig);
    renderConfiguration();
  }
}

function loadSavedUser() {
  const savedUser = localStorage.getItem("testUser");

  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    activeUserEl.textContent = JSON.stringify(currentUser, null, 2);
    cfgDummyUser.textContent = currentUser.id || "-";
    userSelect.value = currentUser.id || "user1";
  }
}

function renderConfiguration() {
  cfgFirstName.textContent = currentConfig.firstName || "-";
  cfgLastName.textContent = currentConfig.lastName || "-";
  cfgOrganization.textContent = currentConfig.organization || "-";

  firstNameInput.value = currentConfig.firstName || "";
  lastNameInput.value = currentConfig.lastName || "";
  organizationInput.value = currentConfig.organization || "";
}

function openConfigModal() {
  renderConfiguration();
  configModal.classList.remove("hidden");
}

function closeConfigModal() {
  configModal.classList.add("hidden");
}

function saveConfiguration() {
  currentConfig = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    organization: organizationInput.value
  };

  localStorage.setItem("messengerConfig", JSON.stringify(currentConfig));
  renderConfiguration();
  closeConfigModal();

  log(
    "Configuration saved: " +
    JSON.stringify(currentConfig)
  );
}

function applyUser() {
  const selected = userSelect.value;
  currentUser = USERS[selected];

  localStorage.setItem("testUser", JSON.stringify(currentUser));
  activeUserEl.textContent = JSON.stringify(currentUser, null, 2);
  cfgDummyUser.textContent = currentUser.id || "-";

  log("User applied: " + selected);
}

function openChat() {
  if (window.Genesys) {
    Genesys("command", "Messenger.open");
    log("Chat opened");
  } else {
    log("Genesys not loaded yet");
  }
}

function resetSession() {
  localStorage.removeItem("testUser");
  sessionStorage.clear();
  activeUserEl.textContent = "";
  cfgDummyUser.textContent = "-";
  currentUser = null;

  log("Session reset");
}

function log(msg) {
  const time = new Date().toLocaleTimeString();
  debugLog.textContent += `[${time}] ${msg}\n`;
}
