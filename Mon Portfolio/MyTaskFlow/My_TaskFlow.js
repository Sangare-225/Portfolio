/**
 * ==========================================================================
 * 1. INITIALISATION ET VARIABLES GLOBALES
 * Sélection des éléments du DOM et état de l'application
 * ==========================================================================
*/
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterSubject = document.getElementById("filterSubject");
const filterStatus = document.getElementById("filterStatus");
const filterTag = document.getElementById("filterTag");
const sortBy = document.getElementById("sortBy");
const searchBar = document.getElementById("searchBar");
const formTitle = document.getElementById("formTitle");
const importFile = document.getElementById("importFile");
const urgentAlert = document.getElementById("urgentAlert");
const urgentMessage = document.getElementById("urgentMessage");

// Chargement des données depuis le [LocalStorage MDN](https://developer.mozilla.org)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null; // Stocke l'index de la tâche en cours de modification
let darkMode = localStorage.getItem("darkMode") === "true";

// Application du thème au chargement
if (darkMode) {
  document.body.classList.add("dark");
  document.getElementById("themeIcon").textContent = "☀️";
}

/**
 * ==========================================================================
 * 2. GESTION DU THÈME ET PERSISTANCE
 * ==========================================================================
*/

/** Bascule entre mode clair et mode sombre */
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark");
  document.getElementById("themeIcon").textContent = darkMode ? "☀️" : "🌙";
  localStorage.setItem("darkMode", darkMode);
}

/** Sauvegarde la liste des tâches et met à jour l'interface */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateStats();
  checkUrgentTasks();
}

/**
 * ==========================================================================
 * 3. LOGIQUE MÉTIER & CALCULS
 * ==========================================================================
 */

/** Vérifie s'il y a des tâches non terminées échéant dans moins de 24h */
function checkUrgentTasks() {
  const now = new Date();
  const urgent = tasks.filter(t => {
    if (t.done) return false;
    const diff = new Date(t.date) - now;
    const hours = diff / (1000 * 60 * 60);
    return hours <= 24 && hours > 0;
  });

  if (urgent.length > 0) {
    urgentAlert.classList.add("show");
    urgentMessage.textContent = `Vous avez ${urgent.length} tâche(s) à terminer dans les 24 heures !`;
  } else {
    urgentAlert.classList.remove("show");
  }
}

/** Calcule et affiche les compteurs (Total, Terminées, Progression) */
function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("doneTasks").textContent = done;
  document.getElementById("pendingTasks").textContent = total - done;
  document.getElementById("progressPercent").textContent = progress + "%";
  document.getElementById("progressBar").style.width = progress + "%";
}

/**
 * Calcule le temps restant avant l'échéance
 * @param {string} date - La date cible au format YYYY-MM-DD
 * @returns {Object} Objet contenant le texte à afficher et l'état d'urgence
 */
function getTimeRemaining(date) {
  const diff = new Date(date) - new Date();
  if (diff <= 0) return { text: "⏱️ Échéance dépassée", isOverdue: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return { 
    text: `⏳ ${days}j ${hours}h restants`, 
    isOverdue: false,
    isUrgent: diff <= 24 * 60 * 60 * 1000
  };
}

/**
 * ==========================================================================
 * 4. AFFICHAGE ET FILTRAGE (RENDERING)
 * ==========================================================================
 */

/** Génère dynamiquement le contenu de la liste des tâches */
function renderTasks() {
  taskList.innerHTML = "";
  
  // Récupération des valeurs de filtres
  const selectedSubject = filterSubject.value;
  const selectedStatus = filterStatus.value;
  const selectedTag = filterTag.value;
  const searchTerm = searchBar.value.toLowerCase();

  // Filtrage des données
  let filtered = tasks.filter((task, index) => {
    task.originalIndex = index; // Garde la trace de l'index réel pour les actions
    const matchSubject = selectedSubject === "" || task.subject === selectedSubject;
    const matchStatus = selectedStatus === "" || (selectedStatus === "done" ? task.done : !task.done);
    const matchTag = selectedTag === "" || (task.tags && task.tags.includes(selectedTag));
    const matchSearch = task.title.toLowerCase().includes(searchTerm) || task.subject.toLowerCase().includes(searchTerm);
    
    return matchSubject && matchStatus && matchTag && matchSearch;
  });

  // Tri des données (Date, Priorité ou Matière)
  const sortOption = sortBy.value;
  if (sortOption === "date") filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  // ... autres tris ...

  // Mise à jour des listes de filtres (matières et tags existants)
  updateFilterSubjects();
  updateFilterTags();

  // Affichage "Liste vide" si aucun résultat
  if (filtered.length === 0) {
    taskList.innerHTML = `<div class="card empty-state"><div class="empty-icon">📭</div><p>Aucune tâche</p></div>`;
    return;
  }

  // Création des éléments HTML pour chaque tâche
  filtered.forEach((task) => {
    const timeInfo = getTimeRemaining(task.date);
    const taskEl = document.createElement("div");
    taskEl.className = `task-card ${timeInfo.isUrgent && !task.done ? 'urgent' : ''} ${task.done ? 'done' : ''}`;
    
    // Insertion du template HTML
    taskEl.innerHTML = `
      <div class="task-content">
        <h3 class="task-header ${task.done ? 'done' : ''}">${task.title}</h3>
        <!-- ... reste du template ... -->
      </div>
      <div class="task-actions">
        <button class="btn btn-toggle-done">${task.done ? "↩️" : "✅"}</button>
        <button class="btn btn-edit">✏️</button>
        <button class="btn btn-delete">🗑️</button>
      </div>
    `;
    
    // Attachement des événements sur les boutons créés
    const idx = task.originalIndex;
    taskEl.querySelector('.btn-toggle-done').onclick = () => toggleDone(idx);
    taskEl.querySelector('.btn-edit').onclick = () => editTask(idx);
    taskEl.querySelector('.btn-delete').onclick = () => { if(confirm("Supprimer ?")) deleteTask(idx); };

    taskList.appendChild(taskEl);
  });
}

/** Supprime une tâche de l'array et rafraîchit l'affichage */
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

/**
 * ========================================================================
 * 5. ACTIONS UTILISATEUR (AJOUT / MODIF / TOGGLE / IMPORT / EXPORT)
 * ========================================================================
 */

const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const subjectInput = document.getElementById("subject");
const priorityInput = document.getElementById("priority");
const tagsInput = document.getElementById("tags");
const descriptionInput = document.getElementById("description");

function resetForm() {
  taskForm.reset();
  editIndex = null;
  formTitle.textContent = "âž• Ajouter une tÃ¢che";
}

function buildTaskFromForm() {
  const rawTags = tagsInput.value
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  return {
    title: titleInput.value.trim(),
    date: dateInput.value,
    subject: subjectInput.value.trim(),
    priority: priorityInput.value,
    tags: rawTags,
    description: descriptionInput.value.trim(),
    done: false,
    createdAt: new Date().toISOString()
  };
}

function editTask(index) {
  const task = tasks[index];
  if (!task) return;

  titleInput.value = task.title || "";
  dateInput.value = task.date || "";
  subjectInput.value = task.subject || "";
  priorityInput.value = task.priority || "Moyenne";
  tagsInput.value = Array.isArray(task.tags) ? task.tags.join(", ") : "";
  descriptionInput.value = task.description || "";

  editIndex = index;
  formTitle.textContent = "âœï¸ Modifier la tÃ¢che";
  titleInput.focus();
}

function toggleDone(index) {
  const task = tasks[index];
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  renderTasks();
}

function updateFilterSubjects() {
  const current = filterSubject.value;
  const subjects = Array.from(new Set(tasks.map(t => t.subject).filter(Boolean)));

  filterSubject.innerHTML = `<option value="">ðŸ“š Toutes les matiÃ¨res</option>`;
  subjects.forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    filterSubject.appendChild(opt);
  });

  if (subjects.includes(current)) filterSubject.value = current;
}

function updateFilterTags() {
  const current = filterTag.value;
  const tags = new Set();
  tasks.forEach(t => {
    if (Array.isArray(t.tags)) t.tags.forEach(tag => tags.add(tag));
  });

  filterTag.innerHTML = `<option value="">ðŸ·ï¸ Tous les tags</option>`;
  Array.from(tags).forEach(tag => {
    const opt = document.createElement("option");
    opt.value = tag;
    opt.textContent = tag;
    filterTag.appendChild(opt);
  });

  if (tags.has(current)) filterTag.value = current;
}

function exportTasks() {
  const data = JSON.stringify(tasks, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tasks.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importTasksFromFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error("Format invalide");

      tasks = data.map(t => ({
        title: t.title || "Sans titre",
        date: t.date || "",
        subject: t.subject || "",
        priority: t.priority || "Moyenne",
        tags: Array.isArray(t.tags) ? t.tags : [],
        description: t.description || "",
        done: Boolean(t.done),
        createdAt: t.createdAt || new Date().toISOString()
      }));

      saveTasks();
      renderTasks();
    } catch (e) {
      alert("Impossible d'importer ce fichier JSON.");
    }
  };
  reader.readAsText(file);
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!titleInput.value.trim() || !dateInput.value || !subjectInput.value.trim()) {
    return;
  }

  if (editIndex !== null) {
    const updated = buildTaskFromForm();
    updated.done = tasks[editIndex]?.done || false;
    updated.createdAt = tasks[editIndex]?.createdAt || updated.createdAt;
    tasks[editIndex] = updated;
  } else {
    tasks.push(buildTaskFromForm());
  }

  saveTasks();
  renderTasks();
  resetForm();
});

importFile.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (file) importTasksFromFile(file);
  importFile.value = "";
});

filterSubject.addEventListener("change", renderTasks);
filterStatus.addEventListener("change", renderTasks);
filterTag.addEventListener("change", renderTasks);
sortBy.addEventListener("change", renderTasks);
searchBar.addEventListener("input", renderTasks);

// Initialisation au chargement de la page
updateStats();
renderTasks();
checkUrgentTasks();
