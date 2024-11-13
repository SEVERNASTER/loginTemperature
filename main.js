// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
    writeBatch,
    query,
    where,
    limit,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// const declarations

const homePage = document.getElementById('homePage');
const spans = homePage.querySelector('.login-container').querySelectorAll('span');
const customAlertWindow = document.getElementById('customAlertWindow');
const tableBody = document.querySelector('tbody');
const noDataRow = tableBody.querySelector('.no-data');
const saveData = document.getElementById('saveData');
const seeDataBtn = document.getElementById('seeData');
const logoutBtn = document.getElementById('logout');
const appContent = document.querySelector('.flip-container');
const loginScreen = document.getElementById('loginScreen');
const loginBtn = document.getElementById('loginBtn');
const signUpScreen = document.getElementById('signUpScreen');
const signInForm = document.getElementById('signInForm');
const signInWrapper = document.getElementById('signinWrapper');
const wrapper = document.getElementById('wrapper');
const checkColor = '#10A37F';
const alertColor = '#fe8d59';
const errorColor = '#ee4b4b';

let currentUser = '';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB80zqAwcJiQB7rJckU_5StOXubm33OLF8",
    authDomain: "temperature-37ceb.firebaseapp.com",
    projectId: "temperature-37ceb",
    storageBucket: "temperature-37ceb.firebasestorage.app",
    messagingSenderId: "717118784754",
    appId: "1:717118784754:web:f7ef03f16fa4ca4c907c6b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// para actualizar el tiempo y la fecha
function updateDate() {
    const date = new Date();
    document.getElementById('date').textContent = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
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


// para validar el loggin

loginBtn.addEventListener('click', async (e) => {
    deployLoadingAnimation2(true);
    e.preventDefault();

    if (recoverLoginInputData().some(value => value === '')) {
        spans.forEach(span => {
            span.style.backgroundColor = alertColor;
        });
        deployCustomWindowAlert('No se permiten campos vacios', alertColor, 'alert', 2000);
        deployLoadingAnimation2(false);
        setTimeout(() => {
            clearSpansStyles();
        }, 2000);
        return;
    }

    const existingUsers = await getExistingUsers();
    // deployLoadingAnimation2(false);

    if (!existingUsers.empty) {
        currentUser = existingUsers.docs[0].data().username;
        giveUserAccess();
    } else {
        deployCustomWindowAlert('Usuario o contraseña incorrectos', errorColor, 'error', 1500);
        checkCredentials(false);
        setTimeout(() => {
            clearSpansStyles();
        }, 1500);
    }
    deployLoadingAnimation2(false);
});

async function getExistingUsers() {
    const user = document.getElementById('loginInputUsername').value;
    const pass = document.getElementById('loginInputPassword').value;

    const usersRef = collection(db, 'users');
    const checkQuery = query(usersRef, where('username', '==', user), where('password', '==', pass));
    return await getDocs(checkQuery);
}

function giveUserAccess() {
    deployCustomWindowAlert(`Bienvenido ${currentUser}`, checkColor, 'check', 4000);
    checkCredentials(true);
    setTimeout(() => {
        switchToAppContent();
        loginScreen.querySelector('form').reset();
        setTimeout(() => {
            clearSpansStyles();
        }, 1500);
    }, 1500);
}

function deployLoadingAnimation(deployed) {
    if (deployed) {
        homePage.querySelector('.login-container').querySelectorAll('span').forEach(span => {
            span.style.display = 'inline';
        })
        return
    }
    homePage.querySelector('.login-container').querySelectorAll('span').forEach(span => {
        span.style.display = 'none';
    })
}

function deployLoadingAnimation2(deployed) {
    spans.forEach(span => {
        span.style.animation = deployed ? 'animateBlink 3s linear infinite' : 'none';
        span.style.animationDelay = deployed ? 'calc(var(--i) * (3s / 50))' : '0s';
    });
}

function checkCredentials(isCorrect) {
    spans.forEach(span => {
        span.style.backgroundColor = isCorrect ? '#0ef' : '#ee4b4b';
    })
}

function clearSpansStyles() {
    spans.forEach(span => {
        span.style.backgroundColor = '#2c4766';
    })
}

function switchToAppContent() {
    homePage.style.transform = 'translateX(-100%)';
    appContent.style.transform = 'translateX(0)';
}

function recoverLoginInputData() {
    const loginInputs = document.querySelectorAll('.input-box');
    let inputData = [];
    loginInputs.forEach(wrapper => {
        inputData.push(wrapper.querySelector('input').value);
    });
    return inputData;
}


// para el logout

logoutBtn.addEventListener('click', () => {
    currentUser = '';
    appContent.style.transform = 'translateX(100%)';
    homePage.style.transform = 'translateX(0)';
})


// para cambiar enre login y sign up

document.getElementById('signUpLink').addEventListener('click', () => {
    loginScreen.style.transform = 'translateY(-100%)';
    signUpScreen.style.transform = 'translateY(0)';
    setTimeout(() => {
        loginScreen.querySelector('form').reset();
    }, 1000);
});

document.getElementById('signUpScreenGoBackBtn').addEventListener('click', (e) => backToLogin(e));

function backToLogin(e) {
    e.preventDefault();
    loginScreen.style.transform = 'translateY(0)';
    signUpScreen.style.transform = 'translateY(100%)';
    setTimeout(() => {
        signUpScreen.querySelector('form').reset();
    }, 1000);
}


// para crear una nueva cuenta
document.getElementById('signUpCreateAccountBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (recoverSignInInputData().some(value => value === '')) {
        deployCustomWindowAlert('No se permiten campos vacios', alertColor, 'alert', 2500);
        changeSignInToErrorColor(false);
        return;
    }
    setSignInLoadingAnimation();
    let inputData = recoverSignInInputData();
    checkExistingUser(e, inputData[1], inputData[0], inputData);
});



function backToOriginalSignInStyle(){
    signInWrapper.style.border = `solid 3px #0ef`;
    signInWrapper.style.boxShadow = `none`;
    signInWrapper.style.filter = 'hue-rotate(0)';
    signInForm.querySelector('h2').style.color = '#0ef';
    signInForm.querySelector('form')
    .querySelectorAll('button').forEach(button => {
        button.style.backgroundColor = '#0ef';
        button.style.boxShadow = `0 0 10px #0ef`;
    });
}

function setSignInLoadingAnimation() {
    wrapper.classList.add('show-before');
    wrapper.classList.add('show-after');
    signInWrapper.style.border = `none`;
    signInWrapper.style.animation = 'rotate-colors 1s linear infinite';
}

function removeSignInLoadingAnimation(){
    wrapper.classList.remove('show-before');
    wrapper.classList.remove('show-after');
    signInWrapper.style.animation = 'none';
}

function setSignInErrorFeedback(){
    removeSignInLoadingAnimation();
    changeSignInToErrorColor(true);
}

function changeSignInToErrorColor(isErrorColor){
    signInWrapper.style.border = isErrorColor ?  `solid 4px ${errorColor}` : `solid 4px ${alertColor}`;
    signInWrapper.style.boxShadow = isErrorColor ? `0 0 50px ${errorColor}` : `0 0 50px ${alertColor}`;
    signInForm.querySelector('h2').style.color = isErrorColor ? errorColor : alertColor;
    signInForm.querySelector('form')
    .querySelectorAll('button').forEach(button => {
        button.style.backgroundColor = isErrorColor ? errorColor : alertColor;
        button.style.boxShadow = isErrorColor ? `0 0 10px ${errorColor}` : `0 0 10px ${alertColor}`;
    });
    setTimeout(() => {
        backToOriginalSignInStyle();
    }, 2500);
}

function setSuccsesfulSignInFeedback(e){
    removeSignInLoadingAnimation();
    signInWrapper.style.border = `solid 4px #0ef`;
    signInWrapper.style.boxShadow = `0 0 50px #0ef`;
    setTimeout(() => {
        backToLogin(e);
        setTimeout(() => {
            backToOriginalSignInStyle();
        }, 2000);
    }, 2000);
}

function recoverSignInInputData() {
    const signUpInputs = document.querySelectorAll('.input-group');
    let inputData = [];
    signUpInputs.forEach(wrapper => {
        inputData.push(wrapper.querySelector('input').value);
    });
    return inputData;
}

async function checkExistingUser(e, username, email, inputData) {
    if (await existsTheUser(username, email)) {
        setSignInErrorFeedback();
        deployCustomWindowAlert('Usuario o correo ya existentes', errorColor, 'error', 2500);
        return;
    }
    await createNewUser(inputData);
    deployCustomWindowAlert('Usuario creado exitosamente', checkColor, 'check', 4000);
    setSuccsesfulSignInFeedback(e);
}

async function existsTheUser(username, email) {
    let alreadyExists = true;

    const users = collection(db, 'users');
    const existedEmailQuery = query(users, where('email', '==', email));
    const existedUsernameQuery = query(users, where('username', '==', username));

    const querySnapshot1 = await getDocs(existedEmailQuery);
    const querySnapshot2 = await getDocs(existedUsernameQuery);

    if (querySnapshot1.empty && querySnapshot2.empty) {
        alreadyExists = false;
    }
    return alreadyExists;
}

async function createNewUser(data) {
    try {
        const userCollection = collection(db, 'users');
        await addDoc(userCollection, {
            email: data[0],
            username: data[1],
            password: data[2]
        })
        console.log('account creation succeffuly')
    } catch (error) {
        console.log('Something went wrong: ' + error);
    }
}

//verificar si existen espacios vacios

function deployCustomWindowAlert(text, color, visibleIcon, duration) {
    hideIconsExcept(visibleIcon);
    customAlertWindow.querySelector('p').innerText = text;
    customAlertWindow.style.backgroundColor = color;
    customAlertWindow.style.transform = 'translateY(20px)';
    setTimeout(() => {
        customAlertWindow.style.transform = 'translateY(-100%)';
    }, duration);
}

function hideIconsExcept(visibleIcon) {
    document.querySelectorAll('.window-icons').forEach(element => {
        element.style.display = 'none';
        if (element.id === visibleIcon) {
            element.style.display = 'inline';
        }
    });
}




// async function addTemperatureReading(date, temperature, time, user) {
//     try {
//         // Referencia a la colección "temperatureReadings"
//         const collectionRef = collection(db, "temperatureReadings");

//         // Añadir un nuevo documento a la colección
//         await addDoc(collectionRef, {
//             date: date,
//             temperature: temperature,
//             time: time,
//             user: user
//         });

//     } catch (error) {
//         console.error("Failed in adding temperature: ", error);
//     }
// }

// Para añadir temperatura
async function addTemperature(temperature, date, time) {
    try {
        disableSaveDataButton();
        const collectionRef = collection(db, 'temperatureReadings');

        const newTemperature = await addDoc(collectionRef, {
            date,
            temperature,
            time,
            user: currentUser
        })

        deployCustomWindowAlert('Temperatura guardada', checkColor, 'check', 2000);
        // console.log('New temperature inserted with id: ' + newTemperature.id);
    } catch (error) {
        console.error("Failed in adding temperature: ", error);
    }
}

function disableSaveDataButton() {
    saveData.style.opacity = '0.5';
    saveData.style.cursor = 'not-allowed';
    saveData.disabled = true;
    saveData.innerText = 'guardando...';
    setTimeout(() => {
        saveData.style.opacity = '1';
        saveData.style.cursor = 'pointer';
        saveData.disabled = false;
        // setInterval(() => {
        saveData.innerText = 'Guardar dato';
        // }, 1000);
    }, 2000);
}

function recoverPaneleDataAndInsert() {
    let data = [];
    const panelData = document.querySelectorAll('.panel-data');
    panelData.forEach(field => {
        data.push(field.textContent);
    })
    addTemperature(data[2], data[0], data[1]);
}

document.getElementById('saveData').addEventListener('click', recoverPaneleDataAndInsert);

// Llamada de ejemplo para agregar un documento
// await addTemperature("13/13/13", 19.7, "16:21", "@nueva");


/**todo piola pero al hacer scroll en la tabla, llega hasta cierto punto y se sube
 * pa arriba fix it
 */






// peticion para obtener los datos y ponerlos en la tabla y para el efecto de giro
function flipContainer() {
    const flipInner = document.querySelector(".flip-inner");
    flipInner.classList.toggle("flipped");
}

async function getTemeratureData() {
    flipContainer();

    try {
        const q = query(
            collection(db, 'temperatureReadings'),
            orderBy('date', 'desc'),
            orderBy('time', 'desc')
        );
        const querySnapshot = await getDocs(q);
        tableBody.innerHTML = ``;

        if (!querySnapshot.empty) {
            let newRow;
            querySnapshot.forEach(doc => {
                const data = doc.data();
                newRow = document.createElement('tr');

                newRow.innerHTML = `
                    <td>${data.temperature} °C</td>
                    <td>${data.date}</td>
                    <td>${data.time}</td>
                    <td>${data.user}</td>
                `;
                tableBody.appendChild(newRow);
            });
            return;
        }

        tableBody.appendChild(noDataRow);

    } catch (error) {
        console.error('Something went wrong at: ' + error);
    }
}


seeDataBtn.addEventListener("click", getTemeratureData);
document.getElementById("backBtn").addEventListener("click", flipContainer);





async function deleteDocumentsByQuery(field, operator, value, limitCount) {
    const batch = writeBatch(db);
    const collectionRef = collection(db, "temperatureReadings");

    // Configura la consulta con la condición y el límite
    const q = query(collectionRef, where(field, operator, value), limit(limitCount));

    try {
        const querySnapshot = await getDocs(q);

        // Agrega cada documento al batch de eliminación
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Ejecuta el batch de eliminación
        await batch.commit();
        console.log(`Hasta ${limitCount} documentos eliminados con la condición especificada.`);
    } catch (error) {
        console.error("Error al eliminar documentos:", error);
    }
}

// await deleteDocumentsByQuery("user", "==", "@nueva", 10);



//para borrar todos los documentos de la coleccion de la base de datos en lotes de 20
async function deleteAllTemperatureDocuments() {
    const collectionRef = collection(db, "temperatureReadings");
    const batchSize = 20;
    let deletedCount = 0;

    while (true) {
        const q = query(collectionRef, limit(batchSize));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) break;

        const batchPromises = [];
        querySnapshot.forEach((doc) => {
            batchPromises.push(deleteDoc(doc.ref));
            deletedCount++;
        });

        await Promise.all(batchPromises);
        console.log(`Eliminados ${deletedCount} documentos`);
    }
    console.log("Todos los documentos eliminados.");
}






