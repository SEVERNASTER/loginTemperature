const firebaseConfig = {
    apiKey: "AIzaSyAXNQdj_tJ_siPr5w_WddQuNpDSZiETE70",
    authDomain: "info2024-5130d.firebaseapp.com",
    databaseURL: "https://info2024-5130d-default-rtdb.firebaseio.com",
    projectId: "info2024-5130d",
    storageBucket: "info2024-5130d.appspot.com",
    messagingSenderId: "43657857517",
    appId: "1:43657857517:web:8861b624f1c514dcfbffe4",
    measurementId: "G-LBB34NTTW7"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inicializar Firestore usando la API modular
const db = firebase.firestore.getFirestore(app);

// Referencia a la colección "temperatureReadings"
const collectionRef = firebase.firestore.collection(db, "temperatureReadings");

// Función para insertar un nuevo registro de temperatura
function addTemperatureReading(date, temperature, time, user) {
    firebase.firestore.addDoc(collectionRef, {
        date: date,
        temperature: temperature,
        time: time,
        user: user
    })
    .then((docRef) => {
        console.log("Documento agregado con ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error al agregar el documento: ", error);
    });
}

// Llamada de ejemplo para agregar un documento
addTemperatureReading("13/13/13", 19.7, "16:21", "@admin123");


/*
// Referencia a la base de datos
const dbRef = firebase.database().ref();

// Función para obtener temperaturas desde la base de datos
function obtenerTemperaturas() {
    // Obtener los datos de la ruta "temperaturas"
    dbRef.child("temperatureReadings").once("value", function(snapshot) {
        const tbody = document.querySelector("tbody");
        tbody.innerHTML = ""; // Limpiar la tabla antes de agregar los nuevos datos

        if (snapshot.exists()) {
            const temperaturas = snapshot.val(); // Obtener los datos
            // Mostrar las temperaturas en la tabla
            for (let key in temperaturas) {
                const temperatura = temperaturas[key];
                const tr = document.createElement("tr");

                const tdTemperatura = document.createElement("td");
                tdTemperatura.textContent = `${temperatura.temperature} C`;

                const tdFecha = document.createElement("td");
                tdFecha.textContent = temperatura.date;

                const tdHora = document.createElement("td");
                tdHora.textContent = temperatura.time;

                const tdUsuario = document.createElement("td");
                tdUsuario.textContent = temperatura.user;

                tr.appendChild(tdTemperatura);
                tr.appendChild(tdFecha);
                tr.appendChild(tdHora);
                tr.appendChild(tdUsuario);

                tbody.appendChild(tr);
            }

            // Ocultar la fila "No hay datos"
            document.getElementById("noData").style.display = "none";
        } else {
            // Si no hay datos, mostrar el mensaje "No hay temperaturas registradas"
            document.getElementById("noData").style.display = "table-row";
            console.log('error wacho')
        }
    });
}
obtenerTemperaturas();*/






function updateDate() {
    const date = new Date();
    document.getElementById('date').textContent = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function updateTime() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(() => {
    updateDate();
    updateTime();
}, 1000);


function flipContainer() {
    const flipInner = document.querySelector(".flip-inner");
    flipInner.classList.toggle("flipped");
}
document.getElementById("seeData").addEventListener("click", flipContainer);
document.getElementById("backBtn").addEventListener("click", flipContainer);
