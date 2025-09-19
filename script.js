const subjects = [
  {
    name: "Physics",
    chapters: ["Laws_of_Motion", "Work_and_Energy", "Oscillations"]
  },
  {
    name: "Chemistry",
    chapters: ["Atomic_Structure", "Chemical_Bonding"]
  },
  {
    name: "Maths",
    chapters: ["Algebra", "Trigonometry", "Calculus"]
  }
];

// Load saved uploads
let pdfFiles = JSON.parse(localStorage.getItem("pdfFiles") || "{}");
let generalUploads = JSON.parse(localStorage.getItem("generalUploads") || "{}");

// If not initialized
if (!generalUploads.Notes) {
  generalUploads = { Notes: [], Assignments: [], Tests: [], HTML: [] };
}

const container = document.getElementById("subjects");
const viewer = document.getElementById("viewer");

// ====================
// SUBJECT-WISE UPLOADS
// ====================
subjects.forEach(subject => {
  const subjDiv = document.createElement("div");
  subjDiv.className = "subject";

  const subjTitle = document.createElement("h2");
  subjTitle.textContent = subject.name;

  const chapterList = document.createElement("div");
  chapterList.className = "chapter-list";

  subject.chapters.forEach(chapter => {
    const chapDiv = document.createElement("div");
    chapDiv.className = "chapter";

    const chapTitle = document.createElement("h3");
    chapTitle.textContent = chapter.replace(/_/g, " ");

    const key = `${subject.name}-${chapter}`;
    const defaultPath = `pdfs/${subject.name}/${chapter}.pdf`;

    // Upload
    const uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.accept = "application/pdf";
    uploadInput.id = `upload-${key}`;

    const uploadLabel = document.createElement("label");
    uploadLabel.setAttribute("for", uploadInput.id);
    uploadLabel.innerHTML = `<i class="fa-solid fa-upload"></i> Upload PDF`;

    const openBtn = document.createElement("button");
    openBtn.innerHTML = `<i class="fa-solid fa-eye"></i> Open PDF`;

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = `<i class="fa-solid fa-trash"></i> Remove PDF`;
    removeBtn.style.background = "#ef4444";
    removeBtn.disabled = !pdfFiles[key];

    // Upload override
    uploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          pdfFiles[key] = e.target.result;
          localStorage.setItem("pdfFiles", JSON.stringify(pdfFiles));
          removeBtn.disabled = false;
          alert(`✅ PDF uploaded for ${chapter}`);
        };
        reader.readAsDataURL(file);
      }
    });

    // Open PDF
    openBtn.addEventListener("click", () => {
      if (pdfFiles[key]) {
        openInViewer(pdfFiles[key]);
      } else {
        openInViewer(defaultPath);
      }
    });

    // Remove uploaded PDF
    removeBtn.addEventListener("click", () => {
      if (pdfFiles[key]) {
        delete pdfFiles[key];
        localStorage.setItem("pdfFiles", JSON.stringify(pdfFiles));
        removeBtn.disabled = true;
        alert("✅ Uploaded PDF removed! Default PDF will be used.");
      }
    });

    chapDiv.appendChild(chapTitle);
    chapDiv.appendChild(uploadInput);
    chapDiv.appendChild(uploadLabel);
    chapDiv.appendChild(openBtn);
    chapDiv.appendChild(removeBtn);
    chapterList.appendChild(chapDiv);
  });

  subjDiv.appendChild(subjTitle);
  subjDiv.appendChild(chapterList);
  container.appendChild(subjDiv);
});

// ====================
// GENERAL UPLOADS (PDF + HTML)
// ====================
const categories = [
  { key: "Notes", label: "📘 Notes", accept: "application/pdf" },
  { key: "Assignments", label: "📝 Assignments", accept: "application/pdf" },
  { key: "Tests", label: "🧪 Tests", accept: "application/pdf" },
  { key: "HTML", label: "🌐 HTML Pages", accept: ".html,.htm,text/html" }
];

const generalDiv = document.createElement("div");
generalDiv.className = "subject";

const generalTitle = document.createElement("h2");
generalTitle.textContent = "📂 General Uploads (PDFs + HTML)";
generalDiv.appendChild(generalTitle);

categories.forEach(cat => {
  const catDiv = document.createElement("div");
  catDiv.className = "chapter-list";

  const catTitle = document.createElement("h3");
  catTitle.textContent = cat.label;

  const uploadInput = document.createElement("input");
  uploadInput.type = "file";
  uploadInput.accept = cat.accept;
  uploadInput.multiple = true;
  uploadInput.id = `upload-${cat.key}`;

  const uploadLabel = document.createElement("label");
  uploadLabel.setAttribute("for", uploadInput.id);
  uploadLabel.innerHTML = `<i class="fa-solid fa-upload"></i> Upload ${cat.label}`;

  const fileList = document.createElement("div");
  fileList.className = "chapter-list";

  // Show saved files
  function refreshList() {
    fileList.innerHTML = "";
    generalUploads[cat.key].forEach((file, index) => {
      const fileDiv = document.createElement("div");
      fileDiv.className = "chapter";

      const name = document.createElement("h3");
      name.textContent = file.name;

      const openBtn = document.createElement("button");
      openBtn.innerHTML = `<i class="fa-solid fa-eye"></i> Open`;
      openBtn.addEventListener("click", () => openInViewer(file.data));

      const removeBtn = document.createElement("button");
      removeBtn.innerHTML = `<i class="fa-solid fa-trash"></i> Remove`;
      removeBtn.style.background = "#ef4444";
      removeBtn.addEventListener("click", () => {
        generalUploads[cat.key].splice(index, 1);
        localStorage.setItem("generalUploads", JSON.stringify(generalUploads));
        refreshList();
      });

      fileDiv.appendChild(name);
      fileDiv.appendChild(openBtn);
      fileDiv.appendChild(removeBtn);
      fileList.appendChild(fileDiv);
    });
  }

  // Handle multiple uploads
  uploadInput.addEventListener("change", (event) => {
    const files = event.target.files;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        generalUploads[cat.key].push({ name: file.name, data: e.target.result });
        localStorage.setItem("generalUploads", JSON.stringify(generalUploads));
        refreshList();
      };
      reader.readAsDataURL(file);
    });
    alert(`✅ Files uploaded successfully in ${cat.label}`);
  });

  catDiv.appendChild(catTitle);
  catDiv.appendChild(uploadInput);
  catDiv.appendChild(uploadLabel);
  catDiv.appendChild(fileList);
  generalDiv.appendChild(catDiv);

  refreshList();
});

container.appendChild(generalDiv);

// ====================
// IN-PAGE VIEWER
// ====================
function openInViewer(path) {
  viewer.style.display = "block";
  viewer.innerHTML = `<iframe src="${path}" width="100%" height="600px" style="border:none;"></iframe>`;
}
