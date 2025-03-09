document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("dataForm");
    const downloadButton = document.getElementById("download");
    const uploadButton = document.getElementById("upload");
    const fileInput = document.getElementById("fileInput");

    const loadData = () => {
        const data = JSON.parse(localStorage.getItem("formData")) || [];
        const dataTable = document.getElementById("dataTable");
        dataTable.innerHTML = "";
        data.forEach((entry, index) => {
            const row = document.createElement("tr");
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
                <td><button onclick="deleteEntry(${index})">Eliminar</button></td>
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

    const saveData = (entry) => {
        const data = JSON.parse(localStorage.getItem("formData")) || [];
        data.push(entry);
        localStorage.setItem("formData", JSON.stringify(data));
        loadData();
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
        fileInput.value = "";
    });

    

    loadData();
    scheduleDownload();
});
