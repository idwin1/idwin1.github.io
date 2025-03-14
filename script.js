document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("dataForm");
    const downloadButton = document.getElementById("download");
    const uploadButton = document.getElementById("upload");
    const fileInput = document.getElementById("fileInput");
    const detailsSection = document.getElementById("detailsSection");

    let editIndex = null;

    const loadData = () => {
        const data = JSON.parse(localStorage.getItem("formData")) || [];
        const dataTable = document.getElementById("dataTable");
        dataTable.innerHTML = "";
        data.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.addEventListener("click", () => showDetails(index));
            row.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.age}</td>
                <td>${entry.diagnosis}</td>
                <td>${entry.sex}</td>
                <td>${entry.phone}</td>
                <td>${entry.supports}</td>
                <td>${entry.medications}</td>
                <td>${entry.hospital}</td>
                <td>${entry.health}</td>
                <td>${entry.doctor}</td>
                <td>${entry.year_diagnosis}</td>
                <td>${entry.admission_age}</td>
                <td>${entry.birthdate}</td>
                <td>${entry.mother}</td>
                <td>${entry.father}</td>
                <td>${entry.address}</td>
                <td>
                    <button onclick="deleteEntry(${index})">Eliminar</button>
                    <button onclick="editEntry(${index})">Modificar</button>
                </td>
            `;
            dataTable.appendChild(row);
        });
    };

    window.deleteEntry = (index) => {
        const data = JSON.parse(localStorage.getItem("formData")) || [];
        data.splice(index, 1);
        localStorage.setItem("formData", JSON.stringify(data));
        loadData();
    };

    window.editEntry = (index) => {
        const data = JSON.parse(localStorage.getItem("formData")) || [];
        const entry = data[index];
        editIndex = index;

        document.getElementById("name").value = entry.name;
        document.getElementById("age").value = entry.age;
        document.getElementById("diagnosis").value = entry.diagnosis;
        document.getElementById("sex").value = entry.sex;
        document.getElementById("phone").value = entry.phone;
        document.getElementById("supports").value = entry.supports;
        document.getElementById("medications").value = entry.medications;
        document.getElementById("hospital").value = entry.hospital;
        document.getElementById("health").value = entry.health;
        document.getElementById("doctor").value = entry.doctor;
        document.getElementById("year_diagnosis").value = entry.year_diagnosis;
        document.getElementById("admission_age").value = entry.admission_age;
        document.getElementById("birthdate").value = entry.birthdate;
        document.getElementById("mother").value = entry.mother;
        document.getElementById("father").value = entry.father;
        document.getElementById("address").value = entry.address;
    };

    const saveData = (entry) => {
        const data = JSON.parse(localStorage.getItem("formData")) || [];
        if (editIndex !== null) {
            data[editIndex] = entry;
        } else {
            data.push(entry);
        }
        localStorage.setItem("formData", JSON.stringify(data));
        loadData();
        editIndex = null; // Reset edit mode
    };

    const downloadData = () => {
        const data = localStorage.getItem("formData") || "[]";
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const uploadData = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newData = JSON.parse(e.target.result);
                if (Array.isArray(newData)) {
                    const existingData = JSON.parse(localStorage.getItem("formData")) || [];
                    const combinedData = [...existingData, ...newData];
                    localStorage.setItem("formData", JSON.stringify(combinedData));
                    loadData();
                    alert("Datos cargados exitosamente.");
                } else {
                    alert("El archivo no contiene un formato válido.");
                }
            } catch (error) {
                alert("Hubo un error al leer el archivo.");
            }
        };
        reader.readAsText(file);
    };

    const scheduleDownload = () => {
        const scheduledTime = localStorage.getItem("scheduledTime");
        if (!scheduledTime) return;

        const [hour, minute] = scheduledTime.split(":").map(Number);
        const now = new Date();
        const downloadTime = new Date();
        downloadTime.setHours(hour, minute, 0, 0);

        if (downloadTime <= now) {
            downloadTime.setDate(downloadTime.getDate() + 1);
        }

        const delay = downloadTime - now;

        setTimeout(() => {
            downloadData();
            scheduleDownload();
        }, delay);
    };

    const timeInput = document.getElementById("time");
    const scheduleButton = document.createElement("button");
    scheduleButton.textContent = "Programar Descarga";
    scheduleButton.style.marginTop = "10px";
    timeInput.insertAdjacentElement("afterend", scheduleButton);

    scheduleButton.addEventListener("click", () => {
        const selectedTime = timeInput.value;
        if (selectedTime) {
            localStorage.setItem("scheduledTime", selectedTime);
            scheduleDownload();
            alert(`Descarga automática programada a las ${selectedTime}`);
        } else {
            alert("Por favor, selecciona una hora válida.");
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const entry = {
            name: document.getElementById("name").value,
            age: document.getElementById("age").value,
            diagnosis: document.getElementById("diagnosis").value,
            sex: document.getElementById("sex").value,
            phone: document.getElementById("phone").value,
            supports: document.getElementById("supports").value,
            medications: document.getElementById("medications").value,
            hospital: document.getElementById("hospital").value,
            health: document.getElementById("health").value,
            doctor: document.getElementById("doctor").value,
            year_diagnosis: document.getElementById("year_diagnosis").value,
            admission_age: document.getElementById("admission_age").value,
            birthdate: document.getElementById("birthdate").value,
            mother: document.getElementById("mother").value,
            father: document.getElementById("father").value,
            address: document.getElementById("address").value,
        };

        saveData(entry);
        alert("Datos guardados correctamente.");
        form.reset();
    });

    downloadButton.addEventListener("click", downloadData);
    uploadButton.addEventListener("click", () => fileInput.click());
    
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadData(file);
        }
    });


    const showDetails = (index) => {
        const data = JSON.parse(localStorage.getItem("formData")) || [];
        const entry = data[index];

        // Rellenar los detalles
        document.getElementById("detailName").textContent = entry.name;
        document.getElementById("detailAge").textContent = entry.age;
        document.getElementById("detailDiagnosis").textContent = entry.diagnosis;
        document.getElementById("detailSex").textContent = entry.sex;
        document.getElementById("detailPhone").textContent = entry.phone;
        document.getElementById("detailSupports").textContent = entry.supports;
        document.getElementById("detailMedications").textContent = entry.medications;
        document.getElementById("detailHospital").textContent = entry.hospital;
        document.getElementById("detailHealth").textContent = entry.health;
        document.getElementById("detailDoctor").textContent = entry.doctor;
        document.getElementById("detailYearDiagnosis").textContent = entry.year_diagnosis;
        document.getElementById("detailAdmissionAge").textContent = entry.admission_age;
        document.getElementById("detailBirthdate").textContent = entry.birthdate;
        document.getElementById("detailMother").textContent = entry.mother;
        document.getElementById("detailFather").textContent = entry.father;
        document.getElementById("detailAddress").textContent = entry.address;

        // Mostrar la sección de detalles
        detailsSection.style.display = "block";

        // Resaltar la fila seleccionada
        const rows = document.querySelectorAll("table tr");
        rows.forEach(row => row.classList.remove("highlight"));
        const selectedRow = rows[index + 1]; // Ajustamos para excluir el encabezado de la tabla
        selectedRow.classList.add("highlight");
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const entry = {
            name: form.name.value,
            age: form.age.value,
            diagnosis: form.diagnosis.value,
            sex: form.sex.value,
            phone: form.phone.value,
            supports: form.supports.value,
            medications: form.medications.value,
            hospital: form.hospital.value,
            health: form.health.value,
            doctor: form.doctor.value,
            year_diagnosis: form.year_diagnosis.value,
            admission_age: form.admission_age.value,
            birthdate: form.birthdate.value,
            mother: form.mother.value,
            father: form.father.value,
            address: form.address.value,
        };

        const data = JSON.parse(localStorage.getItem("formData")) || [];

        if (editIndex !== null) {
            data[editIndex] = entry;
            editIndex = null;
        } else {
            data.push(entry);
        }

        localStorage.setItem("formData", JSON.stringify(data));
        form.reset();
        loadData();
        detailsSection.style.display = "none";
    });

    loadData();
    scheduleDownload();
});
