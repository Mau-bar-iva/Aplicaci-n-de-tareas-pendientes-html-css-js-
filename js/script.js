const containerNav = document.querySelector(".main__nav-container")
const btnAgregarNota = document.querySelector(".main__nav-button")  //Obtenemos el botón de agregar nota ("+")
const containerNotas = document.querySelector(".main__notes-container") //Obtenemos el contenedor de las notas
const notas = containerNotas.children //Obtenemos las notas que hay en el contenedor
const containerCarpetas = document.querySelector(".folders-container")
//  función para obtener datos del localStorage, lo usamos para obtener las notas guardadas
const obtenerDatoDelStorage = (name) => {
    try {
        let dato = JSON.parse(localStorage.getItem(`${name}`));
        
        if (dato.includes(null)) {
            console.warn(`El dato recuperado para '${name}' no es un arreglo. Se inicializará como un arreglo vacío.`);
            return [];
        }
        return dato;
    } catch (error) {
        console.error(`Error al recuperar datos del localStorage para '${name}':`, error);
        return [];
    }
}

//  Cargar las notas guardadas en el localStorage al iniciar la aplicación.
const cargarNotas = () => {
    let notas = obtenerDatoDelStorage('notas');
    console.log(notas)
    notas.forEach(nota => {
        const htmlNote = crearElementoNota(nota);
        containerNotas.prepend(htmlNote);
    });
}

const cargarCarpetas = () => {
    let carpetas = obtenerDatoDelStorage('carpetas');
 
    carpetas.forEach(carpeta => {
        const htmlNote = crearElementoCarpeta(carpeta);
        containerCarpetas.append(htmlNote);
    });
}


//  Recibe una nota como { titulo, descripcion, fecha, prioridad } y retorna un <div class="main__note">.
const crearElementoNota = (nota) => {
    const htmlNote = document.createElement("div")
    htmlNote.classList.add("main__note")

    htmlNote.innerHTML = `
            <!-- Nota info -->
            <div class="main__notes-container-note">
                    <!-- Entrada checkbox para marcar tarea hecha  -->
                <input type="checkbox" id="note-1-check" class="main__note-checkbox">
                    
                <!-- Titulo de la tarea a hacer -->
                <span class="main__note-text">${capitalizeFirstLetter(nota.titulo)}</span>

                <!-- Boton que despliega las opciones Eliminar y Editar nota -->
                <div>
                    <button type="button" class="main__note-button"><i class="fa-solid fa-ellipsis-vertical main__note-button-ellipsis"></i></button>
                </div> 
                
                <!-- Bloque que contiene los botones Editar y Eliminar nota -->
                <div class="main__note-actions">
                    <div class="actions__container-btns">
                        <button class="main__note__actions__button main__note__actions__button--edit"><svg class="action-edit-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg><span>Edit</span></button>
                    </div>
                    <div class="actions__container-btns">
                        <button class="main__note__actions__button main__note__actions__button--delete"><svg class="action-delete-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg><span>Delete</span></button>
                    </div>
                </div>
            </div>
            <!-- Nota descripción -->
            <div class="main__note-description">
                <div class = "main__note-description-datePriority-container">
                    <span class="note-description-priority">Priority: ${nota.prioridad}</span>
                    <span class="note-description-date">${nota.fecha ? nota.fecha : ""}</span>
                </div>
                <p class="note-description">${capitalizeFirstLetter(nota.descripcion)}</p>
                
            </div>
    `
    //  funciones de checkbox
    const checkBox = htmlNote.querySelector(".main__note-checkbox")
    checkBox.addEventListener('change',()=>{checked(note)})
    
    //  función para mostrar descripción de nota al hacer click en el título
    const texto = htmlNote.querySelector(".main__note-text")
    texto.addEventListener("click", () => {showNoteDescription(htmlNote)})

    //  Obtenemos los elementos necesarios para las funciones de Editar, Eliminar y el menú de opciones
    const ellipsisCont = htmlNote.querySelector(".main__note-actions")  //Obtenemos el contenedor del menú de opciones (Editar / Eliminar)
    const btnEllipsis = htmlNote.querySelector(".main__note-button");   //Obtenemos el botón de opciones (ícono de tres puntos)

    //  Añadimos los eventos correspondientes a los botones que esten dentro del contenedor de botones acciones
    htmlNote.querySelectorAll(".actions__container-btns").forEach((e)=>{
        const firstChild = e.firstElementChild;
        if(firstChild.classList.contains("main__note__actions__button--edit")){
            e.addEventListener("click",()=>{editNote(htmlNote)})
        }else if(firstChild.classList.contains("main__note__actions__button--delete")){
            e.addEventListener("click", ()=>{deleteNote(htmlNote)})
        }
    })
    
    //  Asociamos los eventos a los botones
    btnEllipsis.addEventListener("click",()=>{btnEllipsisEvent(ellipsisCont)})
    return htmlNote;
}
const crearElementoCarpeta = (carpeta) =>{
    const htmlFolder = document.createElement("div")
    htmlFolder.classList.add("folder")

    htmlFolder.innerHTML = `
            <i class="fa-solid fa-folder"></i>
            <span class="folder-title">${carpeta.titulo}</span>
    `
    
    
    
    return htmlFolder;
}

//  funcion checklist para mover nota al final o devolverla a su posición original según su estado
let noteIndexBefore = 0

function checked(note){
    const checkBox = note.querySelector(".main__note-checkbox")
    
    if(checkBox.checked){
        for(let i = 0; i < notas.length; i++){
        if (notas[i] === note) {
            noteIndexBefore = i
        }
    }
        containerNotas.removeChild(note)
        containerNotas.appendChild(note)
    }else{
        containerNotas.removeChild(note)
        containerNotas.insertBefore(note, notas[noteIndexBefore])
    }
}

//  funcion para mostrar descripción de tarea
function showNoteDescription(note){
    const descripcion = note.querySelector(".main__note-description")
    const isVisible = descripcion.classList.contains("main__note-description--visible")

    if(!isVisible){
        descripcion.style.maxHeight = "none";
        descripcion.classList.add("main__note-description--visible")
        
    }else{
        descripcion.style.maxHeight = descripcion.scrollHeight + "px"
    
        requestAnimationFrame(()=>{
            descripcion.style.maxHeight = "0";
            descripcion.classList.remove("main__note-description--visible")
        })
    }
}

//  Alternamos la visualización del menú de acciones con el botón de opciones (tres puntos)
function btnEllipsisEvent(ellipsisCont){
    document.querySelectorAll(".menu").forEach(menu => {
        if (menu !== ellipsisCont) {
            menu.classList.remove("menu");

            const btns = menu.querySelectorAll(".actions__container-btns");

            btns.forEach(btn => {
                btn.style.maxWidth = "0";
                btn.style.paddingLeft = "0";
                btn.style.transform = "scaleX(0)";
                btn.style.opacity = "0";
            });
        }
    });

    ellipsisCont.classList.toggle("menu")

    const isVisible = ellipsisCont.classList.contains("menu")

    const btnEditCont = ellipsisCont.querySelectorAll(".actions__container-btns")[0]
    const btnDeleteCont = ellipsisCont.querySelectorAll(".actions__container-btns")[1]

    if(window.matchMedia("(max-width: 500px)").matches){
        iconBtnEdit = btnEditCont.getElementsByTagName("svg")[0]
        iconBtnDelete = btnDeleteCont.getElementsByTagName("svg")[0]
        spanBtnEdit = btnEditCont.getElementsByTagName("span")[0]
        spanBtnDelete = btnDeleteCont.getElementsByTagName("span")[0]
        console.log(iconBtnEdit)
        spanBtnEdit.style.display="none"
        spanBtnDelete.style.display="none"
        
        if(isVisible){
            requestAnimationFrame(()=>{
                btnEditCont.style.maxWidth = "100%"
                btnEditCont.style.transform = "scaleX(1)";
                btnEditCont.style.padding = "0 15px"
                btnEditCont.style.opacity = "1";
                iconBtnEdit.setAttribute("fill", "#ffff")

                btnDeleteCont.style.maxWidth = "100%"
                btnDeleteCont.style.transform = "scaleX(1)";
                btnDeleteCont.style.padding = "0 15px"
                btnDeleteCont.style.opacity = "1";
                iconBtnDelete.setAttribute("fill", "#ffff")
                }
            )
        }
        return
    }
    if(isVisible){
        requestAnimationFrame(()=>{
            btnEditCont.style.maxWidth = "100%"
            btnEditCont.style.paddingLeft = "30px"
            btnEditCont.style.transform = "scaleX(1)";
            btnEditCont.style.opacity = "1";
            
            btnDeleteCont.style.maxWidth = "100%"
            btnDeleteCont.style.paddingLeft = "30px"
            btnDeleteCont.style.transform = "scaleX(1)";
            btnDeleteCont.style.opacity = "1";
            }
        )
    }else{
        requestAnimationFrame(()=>{
            btnEditCont.style.maxWidth = "0"
            btnEditCont.style.paddingLeft = "0"
            btnEditCont.style.transform = "scaleX(0)";
            btnEditCont.style.opacity = "0";
            
            btnDeleteCont.style.maxWidth = "0"
            btnDeleteCont.style.paddingLeft = "0"
            btnDeleteCont.style.transform = "scaleX(0)";
            btnDeleteCont.style.opacity = "0";
        })
    }
}


//  funcion para editar notas
function editNote(note){
    console.log("editando nota")
    const noteCheck = note.querySelector(".main__note-checkbox")
    const noteTitle = note.querySelector(".main__note-text")
    const notePriority = note.querySelector(".note-description-priority")
    const noteDate = note.querySelector(".note-description-date")
    const noteDescription = note.querySelector(".note-description")

    const newNote = document.createElement("form")
    newNote.classList.add("main__note")
    newNote.innerHTML = `
        <!-- Nota individual -->
            <div class="main__notes-container-note">
                    <!-- Entrada checkbox para marcar tarea hecha  -->
                <input type="checkbox" id="note-1-check" class="note-edit-checkbox">
                    
                <!-- Titulo de la tarea a hacer -->
                <input value="${capitalizeFirstLetter(noteTitle.textContent)}" class="note-edit-title" type="text" required>

                <!-- Boton que despliega las opciones Eliminar y Editar nota -->
                <div>
                    <button type="button" class="note-edit-button"><i class="fa-solid fa-ellipsis-vertical main__note-button-ellipsis"></i></button>
                </div>                
                <!-- Bloque que contiene los botones Editar y Eliminar nota -->
                <div class="main__note-actions">
                    <button class="main__note__actions__button main__note__actions__button--edit">Edit</button>
                    <button class="main__note__actions__button main__note__actions__button--delete">Delete</button>
                </div>
            </div>

            <div class="main__note-description main__note-description--visible">
                <div class = "main__note-description-datePriority-container">
                    <div>
                        <span>Priority: </span>

                        <select class="note-description-priority">
                            <option class="note-description-priority-low">low</option>
                            <option class="note-description-priority-medium">medium</option>
                            <option class="note-description-priority-high">high</option>
                        </select>
                    </div>
                    
                    <div>
                        <span>Fecha: </span>
                        <input type="date" class="note-description-date" value="${noteDate.textContent}">
                    </div>
                </div>
                <textarea class="note-edit-description">${noteDescription.textContent}</textarea>

                <div class="main__note__btnFormContainer">
                    <button type="submit" class="main__note__btnForm-edit">Edit</button>
                    <button class="main__note__btnForm-cancel">Cancel</button>
                </div>
            </div>
            
    `
    containerNotas.replaceChild(newNote, note)
    //establecemos la fecha mínima como la fecha actual
    const dateInput = newNote.querySelector(".note-description-date")
    dateInput.min = new Date().toISOString().split("T")[0] 

    // establecemos la descripción visible y con altura automática
    const descripcion = newNote.querySelector(".main__note-description")
    descripcion.style.maxHeight = "none"

    //  obtenemos las opciones del elemento select
    const newNotePriorityLow = newNote.querySelector(".note-description-priority-low")
    const newNotePriorityMedium = newNote.querySelector(".note-description-priority-medium")
    const newNotePriorityHigh = newNote.querySelector(".note-description-priority-high")

    //  comprueba el texto de prioridad de la nota original y guarda la opcion correspondiente en el select del nuevo form
    if(notePriority.textContent.includes("low")){
        newNotePriorityLow.setAttribute("selected", "selected")
    }else if(notePriority.textContent.includes("medium")){
        newNotePriorityMedium.setAttribute("selected", "selected")
    }else if(notePriority.textContent.includes("high")){
        newNotePriorityHigh.setAttribute("selected", "selected")
    }

    //  función para guardar los cambios del checkbox al editar
    const newCheck = newNote.querySelector(".note-edit-checkbox")
    let estadoFinalCheckbox = noteCheck.checked

    newCheck.addEventListener("change", ()=>{
        estadoFinalCheckbox = newCheck.checked
    })
    
    //  función cancelar, al hacer click en cancelar se reemplaza la nota editada por la original y se oculta la descripción
    const btnCancel = newNote.querySelector(".main__note__btnForm-cancel")
    btnCancel.addEventListener("click",()=>{
        containerNotas.replaceChild(note, newNote)
        descripcion.style.maxHeight = descripcion.scrollHeight + "px"
    
        requestAnimationFrame(()=>{
            descripcion.style.maxHeight = "0";
            descripcion.classList.remove("main__note-description--visible")
        })
    })

    //al enviarse el formulario el contenido de la nota original se actualiza por los del formulario de editar y se reemplaza por la nueva nota
    newNote.addEventListener("submit",(e)=>{
        e.preventDefault();
        let notas = obtenerDatoDelStorage('notas');
        notas.forEach(nota => {
            if (nota.titulo.trim().toLowerCase() === noteTitle.textContent.trim().toLowerCase()) {

                noteTitle.innerHTML = capitalizeFirstLetter(newNote.querySelector(".note-edit-title").value)
                noteDescription.innerHTML = newNote.querySelector(".note-edit-description").value
                notePriority.innerHTML = `Priority: ${newNote.querySelector(".note-description-priority").value}`
                noteDate.textContent = newNote.querySelector(".note-description-date").value
                noteCheck.checked = estadoFinalCheckbox;

                nota.titulo = noteTitle.textContent
                nota.descripcion = noteDescription.textContent
                nota.fecha = noteDate.textContent
                nota.prioridad = newNote.querySelector(".note-description-priority").value
            }
        })

        localStorage.setItem('notas', JSON.stringify(notas));
        containerNotas.replaceChild(note, newNote)
        toastAlert("info", "Success: task edited successfully")
    })

    
}

function toastAlert(alert, text=null){
    const container = document.querySelector(".container")

    const toastContainer = document.createElement("div")
    toastContainer.classList.add("toast__alert-container")

    const alertInfo = document.createElement("i")
    alertInfo.classList.add("fa-solid")
    alertInfo.classList.add("fa-circle-info")
    /*const alertWarning = document.createElement("i")
    alertWarning.classList.add("fa-solid")
    alertWarning.classList.add("fa-triangle-exclamation")
    const alertError = document.createElement("i")
    alertError.classList.add("fa-solid")
    alertError.classList.add("fa-circle-xmark")*/
    const alertSuccess = document.createElement("i")
    alertSuccess.classList.add("fa-solid")
    alertSuccess.classList.add("fa-check")

    const alertText = document.createElement("h6")
    alertText.classList.add("toast__alert-title")

    const btnCloseAlert = document.createElement("button")
    btnCloseAlert.classList.add("toast__btnClose")

    const iconCloseAlert = document.createElement("i")
    iconCloseAlert.classList.add("toast__btnClose-icon")
    iconCloseAlert.classList.add("fa-solid")
    iconCloseAlert.classList.add("fa-xmark")
    
    btnCloseAlert.appendChild(iconCloseAlert)

    btnCloseAlert.addEventListener("click",()=>{
        container.removeChild(document.querySelector(".toast__alert-container"))
    })
    
    //función para que desaparezca en 5 segundos
    setTimeout(()=>{
        container.removeChild(document.querySelector(".toast__alert-container"))
    }, 5000)

    toastContainer.appendChild(btnCloseAlert)

    const det = alert.toLowerCase()

    if(det == "info"){
        alertText.innerHTML= text;
        toastContainer.prepend(alertText)
        toastContainer.prepend(alertInfo)
        toastContainer.classList.add("info")
        container.appendChild(toastContainer)
        
    }
    else if(det == "success"){
        alertText.innerHTML= text;
        toastContainer.prepend(alertText)
        toastContainer.prepend(alertSuccess)
        toastContainer.classList.add("success")
        container.appendChild(toastContainer)
        
    }else{
        console.log("hay error")
    }
}

//  funcion para eliminar nota
function deleteNote(note){
    const des = confirm("Are you sure you want to delete the note?")
    if(des){
        let notasArr = JSON.parse(localStorage.getItem('notas')) || [];

        const id = parseInt(note.dataset.id);

        notasArr = notasArr.filter(nota => nota.id !== id);
        localStorage.setItem('notas', JSON.stringify(notasArr));

        for (let i = 0; i < notas.length; i++) {
            if(notas[i] === note){
                containerNotas.removeChild(notas[i])
                mensajeNoTareas()
            }
        }
        toastAlert("success", "Success: task successfully deleted")
    }else{
        console.log("se canceló la operación")
    }
}

//  función para tranformar primera letra en mayúscula
const capitalizeFirstLetter = (str) =>{
    if(!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1)
}

//  Encargada solo de crear y retornar el <form>, sin insertarlo en el DOM. retorna diccionario {form,inputTitulo, textAreaDeDescripcion, inputFecha, selectPrioridad, btnCancel, btnSubmit}
const crearFormularioNota = () => {
    //Nuevo formulario
    const form = document.createElement("form")
    form.classList.add("form-nueva-nota")

    //Header
    const HeaderText = document.createElement("h1")
    HeaderText.id = "headerText"
    HeaderText.classList.add("headerText")
    HeaderText.innerHTML = "New task"

    //Campo: Titulo
    const inputTitulo = document.createElement("input")
    inputTitulo.classList.add("form-titulo")
    inputTitulo.id = "titulo"
    inputTitulo.type = "text"
    inputTitulo.placeholder = "Task name"
    inputTitulo.setAttribute("required", "required")
    
    //Campo: Descripción
    const textAreaDeDescripcion = document.createElement("textarea")
    textAreaDeDescripcion.classList.add("form-descripcion")
    textAreaDeDescripcion.id = "descripcion"
    textAreaDeDescripcion.rows = 6;
    textAreaDeDescripcion.placeholder = "Task Description..."
    
    //Campo: Fecha limite
    const labelFecha = document.createElement("label")
    labelFecha.textContent = "Due date: ";

    const inputFecha = document.createElement("input")
    inputFecha.classList.add("form-fecha")
    inputFecha.id = "fecha"
    inputFecha.type = "date"
    const fecha = new Date()
    const yyyy = fecha.getFullYear()
    const mm = String(fecha.getMonth() + 1).padStart(2, '0')
    const dd = String(fecha.getDate()).padStart(2, '0')
    const fechaHoy = `${yyyy}-${mm}-${dd}`
    inputFecha.min = fechaHoy

    const contFecha = document.createElement("div") //creamos un contenedor para labelFecha e inputFecha
    contFecha.classList.add("form-fecha-container")
    contFecha.append(labelFecha)
    contFecha.append(inputFecha)
    
    //Campo: prioridad(select)
    const labelPrioridad = document.createElement("label")
    labelPrioridad.textContent = "Priority: "

    const selectPrioridad = document.createElement("select")
    const opcion1 = new Option("Low", "low")
    const opcion2 = new Option("Medium", "medium")
    const opcion3 = new Option("High", "high")

    selectPrioridad.append(opcion1, opcion2, opcion3)
    selectPrioridad.id = "prioridad"
    selectPrioridad.classList.add("form-select")

    const contPrioridad = document.createElement("div") //creamos un contenedor para labelPrioridad y selectPrioridad
    contPrioridad.classList.add("form-select-container")
    contPrioridad.append(labelPrioridad)
    contPrioridad.append(selectPrioridad)
    
    //juntamos los contenedores de fecha y prioridad
    const contFechaPrioridad = document.createElement("div")
    contFechaPrioridad.classList.add("form-fecha-prioridad-container")
    contFechaPrioridad.append(contFecha)
    contFechaPrioridad.append(contPrioridad)
    
    //contenedor de los botones enviar y cancelar
    const contBtns = document.createElement("div")
    contBtns.classList.add("form-btns-container")

    //botón de carpeta
    const btnCarpeta = document.createElement("button")
    btnCarpeta.classList.add("form-btnCarpeta")
    btnCarpeta.type = "button";
    btnCarpeta.textContent = "Create folder";
    const addCarpeta = document.createElement("img")
    addCarpeta.setAttribute("src", "./assets/folder.png")
    btnCarpeta.prepend(addCarpeta)

    //botón de enviar
    const btnSubmit = document.createElement("button")
    btnSubmit.classList.add("form-btnSubmit")
    btnSubmit.type = "submit";
    btnSubmit.textContent = "Add Task";

    //botón de cancelar
    const btnCancel = document.createElement("button")
    btnCancel.classList.add("form-btnCancel")
    btnCancel.type = "button"
    btnCancel.textContent = "Cancel";

    contBtns.append(btnCancel)  //agregamos los botones al contenedor
    contBtns.append(btnSubmit)

    //contenedor del footer del formulario(fecha, prioridad, btns)
    const contFormFooter = document.createElement("footer")
    contFormFooter.classList.add("form-footer-container")

    //añadimos los contenedor de los botones y el contenedor de la fecha y prioridad al contenedor del footer de el formulario
    contFormFooter.append(contFechaPrioridad)
    contFormFooter.append(contBtns)

    //contenedor externos al titulo
    const contContain = document.createElement("div")
    contContain.classList.add("form-content-container")

    //añadimos al contenedor los campos del formulario
    contContain.append(btnCarpeta)
    contContain.append(inputTitulo)
    contContain.append(textAreaDeDescripcion)
    contContain.append(contFormFooter)

    //Añadimos los campos al formulario
    form.prepend(HeaderText)
    form.append(contContain)

    return {form, btnCarpeta,inputTitulo, textAreaDeDescripcion, inputFecha, selectPrioridad, btnCancel, btnSubmit};
}

const crearFormularioCarpeta = () => {
    //Nuevo formulario
    const form = document.createElement("form")
    form.classList.add("form-nueva-carpeta")

    //Header
    const HeaderText = document.createElement("h1")
    HeaderText.id = "headerText"
    HeaderText.classList.add("headerText")
    HeaderText.innerHTML = "New folder"

    //Campo: Titulo
    const inputTitulo = document.createElement("input")
    inputTitulo.classList.add("form-titulo")
    inputTitulo.id = "titulo"
    inputTitulo.type = "text"
    inputTitulo.placeholder = "Folder name"
    inputTitulo.setAttribute("required", "required")
    
    //Campo: Descripción
    const textAreaDeDescripcion = document.createElement("textarea")
    textAreaDeDescripcion.classList.add("form-descripcion")
    textAreaDeDescripcion.id = "descripcion"
    textAreaDeDescripcion.rows = 6;
    textAreaDeDescripcion.placeholder = "Folder Description..."
    
    //Campo: prioridad(select)
    const labelPrioridad = document.createElement("label")
    labelPrioridad.textContent = "Priority: "

    const selectPrioridad = document.createElement("select")
    const opcion1 = new Option("Low", "low")
    const opcion2 = new Option("Medium", "medium")
    const opcion3 = new Option("High", "high")

    selectPrioridad.append(opcion1, opcion2, opcion3)
    selectPrioridad.id = "prioridad"
    selectPrioridad.classList.add("form-select")

    const contPrioridad = document.createElement("div") //creamos un contenedor para labelPrioridad y selectPrioridad
    contPrioridad.classList.add("form-select-container")
    contPrioridad.append(labelPrioridad)
    contPrioridad.append(selectPrioridad)
    
    //contenedor de los botones enviar y cancelar
    const contBtns = document.createElement("div")
    contBtns.classList.add("form-btns-container")

    //botón de enviar
    const btnSubmit = document.createElement("button")
    btnSubmit.classList.add("form-btnSubmit")
    btnSubmit.type = "submit";
    btnSubmit.textContent = "Add Task";

    //botón de cancelar
    const btnCancel = document.createElement("button")
    btnCancel.classList.add("form-btnCancel")
    btnCancel.type = "button"
    btnCancel.textContent = "Cancel";

    contBtns.append(btnCancel)  //agregamos los botones al contenedor
    contBtns.append(btnSubmit)

    //contenedor del footer del formulario(fecha, prioridad, btns)
    const contFormFooter = document.createElement("footer")
    contFormFooter.classList.add("form-footer-container")

    //añadimos los contenedor de los botones y prioridad al contenedor del footer de el formulario
    contFormFooter.append(contBtns)

    //Añadimos los campos al formulario
    form.prepend(HeaderText)
    form.append(inputTitulo)
    form.append(textAreaDeDescripcion)
    form.append(contFormFooter)

    return {form, inputTitulo, textAreaDeDescripcion, selectPrioridad, btnCancel, btnSubmit};
}

const crearFormularioNotaParaCarpeta = () => {
    //Nuevo formulario
    const form = document.createElement("form")
    form.classList.add("form-nueva-nota")

    //Header
    const HeaderText = document.createElement("h1")
    HeaderText.id = "headerText"
    HeaderText.classList.add("headerText")
    HeaderText.innerHTML = "New task"

    //Campo: Titulo
    const inputTitulo = document.createElement("input")
    inputTitulo.classList.add("form-titulo")
    inputTitulo.id = "titulo"
    inputTitulo.type = "text"
    inputTitulo.placeholder = "Task name"
    inputTitulo.setAttribute("required", "required")
    
    //Campo: Descripción
    const textAreaDeDescripcion = document.createElement("textarea")
    textAreaDeDescripcion.classList.add("form-descripcion")
    textAreaDeDescripcion.id = "descripcion"
    textAreaDeDescripcion.rows = 6;
    textAreaDeDescripcion.placeholder = "Task Description..."
    
    //Campo: Fecha limite
    const labelFecha = document.createElement("label")
    labelFecha.textContent = "Due date: ";

    const inputFecha = document.createElement("input")
    inputFecha.classList.add("form-fecha")
    inputFecha.id = "fecha"
    inputFecha.type = "date"
    const fecha = new Date()
    const yyyy = fecha.getFullYear()
    const mm = String(fecha.getMonth() + 1).padStart(2, '0')
    const dd = String(fecha.getDate()).padStart(2, '0')
    const fechaHoy = `${yyyy}-${mm}-${dd}`
    inputFecha.min = fechaHoy

    const contFecha = document.createElement("div") //creamos un contenedor para labelFecha e inputFecha
    contFecha.classList.add("form-fecha-container")
    contFecha.append(labelFecha)
    contFecha.append(inputFecha)
    
    //Campo: prioridad(select)
    const labelPrioridad = document.createElement("label")
    labelPrioridad.textContent = "Priority: "

    const selectPrioridad = document.createElement("select")
    const opcion1 = new Option("Low", "low")
    const opcion2 = new Option("Medium", "medium")
    const opcion3 = new Option("High", "high")

    selectPrioridad.append(opcion1, opcion2, opcion3)
    selectPrioridad.id = "prioridad"
    selectPrioridad.classList.add("form-select")

    const contPrioridad = document.createElement("div") //creamos un contenedor para labelPrioridad y selectPrioridad
    contPrioridad.classList.add("form-select-container")
    contPrioridad.append(labelPrioridad)
    contPrioridad.append(selectPrioridad)
    
    //juntamos los contenedores de fecha y prioridad
    const contFechaPrioridad = document.createElement("div")
    contFechaPrioridad.classList.add("form-fecha-prioridad-container")
    contFechaPrioridad.append(contFecha)
    contFechaPrioridad.append(contPrioridad)
    
    //contenedor de los botones enviar y cancelar
    const contBtns = document.createElement("div")
    contBtns.classList.add("form-btns-container")

    //botón de enviar
    const btnSubmit = document.createElement("button")
    btnSubmit.classList.add("form-btnSubmit")
    btnSubmit.type = "submit";
    btnSubmit.textContent = "Add Task to folder";

    //botón de cancelar
    const btnCancel = document.createElement("button")
    btnCancel.classList.add("form-btnCancel")
    btnCancel.type = "button"
    btnCancel.textContent = "Cancel";

    contBtns.append(btnCancel)  //agregamos los botones al contenedor
    contBtns.append(btnSubmit)

    //contenedor del footer del formulario(fecha, prioridad, btns)
    const contFormFooter = document.createElement("footer")
    contFormFooter.classList.add("form-footer-container")

    //añadimos los contenedor de los botones y el contenedor de la fecha y prioridad al contenedor del footer de el formulario
    contFormFooter.append(contFechaPrioridad)
    contFormFooter.append(contBtns)

    //contenedor externos al titulo
    const contContain = document.createElement("div")
    contContain.classList.add("form-content-container")

    //añadimos al contenedor los campos del formulario
    contContain.append(inputTitulo)
    contContain.append(textAreaDeDescripcion)
    contContain.append(contFormFooter)

    //Añadimos los campos al formulario
    form.prepend(HeaderText)
    form.append(contContain)

    return {form,inputTitulo, textAreaDeDescripcion, inputFecha, selectPrioridad, btnCancel, btnSubmit};
}

// función para generar un id único
function generarId(tipo) {
    const clave = `ultimoId_${tipo}`;
    let ultimoId = parseInt(localStorage.getItem(clave));

    // Si no existe contador, lo inicializamos desde los datos guardados
    if (isNaN(ultimoId)) {
      let datos = JSON.parse(localStorage.getItem(`${tipo}s`)) || [];

      // Si hay elementos con id, tomamos el mayor. Si no, arrancamos en 0.
      if (datos.length > 0) {
        ultimoId = Math.max(...datos.map(d => d.id || 0));
      } else {
        ultimoId = 0;
      }
  }

  // Incrementamos y guardamos el nuevo valor
  ultimoId++;
  localStorage.setItem(clave, ultimoId);
  return ultimoId;
}

// 🧹 Corrige notas sin ID (solo una vez)
function inicializarNotas() {
    let notas = JSON.parse(localStorage.getItem("notas")) || [];

    if (notas.length > 0 && notas[0].id === undefined) {
      // Si la primera nota no tiene id, inicializamos todas
      notas = notas.map((nota, index) => ({
        id: index + 1,
        ...nota
      }));

      localStorage.setItem("notas", JSON.stringify(notas));
      localStorage.setItem("ultimoId_nota", notas.length);
      console.log(`✅ Se asignaron IDs automáticamente a ${notas.length} notas.`);
    }
}

//  Asocia el evento de submit al formulario, obtiene los datos, crea la nota y la agrega al contenedor.
const manejarSubmitFormulario = (formulario, tipo, item="null") => {

    let form = formulario.form
    const inputTitulo = form.querySelector("#titulo") ?? null;
    const textArea = form.querySelector("#descripcion") ?? null;
    const inputFecha = form.querySelector("#fecha") ?? null;
    const selectPrioridad = form.querySelector("#prioridad") ?? null;
    
    form.addEventListener("submit",(e)=>{
        e.preventDefault();
        
        if(tipo.toLowerCase() === "nota"){
            
            const newNota = {
                id: generarId("nota"),
                titulo: inputTitulo?.value || "",
                descripcion: textArea?.value || "",
                fecha: inputFecha?.value || "",
                prioridad: selectPrioridad?.value || "",
            };

            if (!localStorage.getItem("notas")) {
                localStorage.setItem("notas", JSON.stringify([])); // crea vacía si no existe
            }

            // Guardamos la nota en el localStorage
            let notas = obtenerDatoDelStorage('notas') || [];
            notas.push(newNota);
            localStorage.setItem('notas', JSON.stringify(notas));

            const htmlNote = crearElementoNota(newNota);
            alert("Guardando nota...")
            containerNotas.prepend(htmlNote);
            containerNotas.removeChild(form)

        }else if(tipo.toLowerCase() === "carpeta"){
            const newCarpeta={
                id: generarId("carpeta"),
                titulo: inputTitulo?.value || "",
                descripcion: textArea?.value || "",
                prioridad: selectPrioridad?.value || "",
                notas: [] || ""
            }

            if (!localStorage.getItem("carpetas")) {
                localStorage.setItem("carpetas", JSON.stringify([])); // crea vacía si no existe
            }

            let carpetas = JSON.parse(localStorage.getItem('carpetas')) || [];

            carpetas.push(newCarpeta);
            localStorage.setItem('carpetas', JSON.stringify(carpetas));

            const htmlFolder = crearElementoCarpeta(newCarpeta);
            containerCarpetas.prepend(htmlFolder);
            containerNotas.removeChild(form)

        }else if (tipo.toLowerCase() == "notadecarpeta") {
            const newNotaCarpeta = {
                id: generarId("nota"),
                titulo: (inputTitulo?.value || "").trim(),
                descripcion: (textArea?.value || "").trim(),
                fecha: inputFecha?.value || "",
                prioridad: selectPrioridad?.value || ""
            };

            // Aseguramos que exista la clave carpetas
            if (!localStorage.getItem("carpetas")) {
                localStorage.setItem("carpetas", JSON.stringify([]));
            }

            // Obtenemos array de carpetas desde storage (usa tu helper para parsear)
            let carpetas = obtenerDatoDelStorage('carpetas') || [];

            // Normalizamos título para buscar (evita problemas de mayus/minus/espacios)
            const tituloBuscado = (item && item.titulo) ? item.titulo.trim().toLowerCase() : null;

            if (!tituloBuscado) {
                console.warn("No se recibió una carpeta válida en 'item'. item:", item);
                toastAlert("info", "Error: carpeta no válida");
                return;
            }

            // Buscamos la carpeta por título
            const index = carpetas.findIndex(c => (c.titulo || "").trim().toLowerCase() === tituloBuscado);

            if (index === -1) {
                console.warn(`No se encontró la carpeta "${item.titulo}" en localStorage.`);
                toastAlert("info", `No se encontró la carpeta "${item.titulo}"`);
                return;
            }

            // Aseguramos que exista el array notas
            if (!Array.isArray(carpetas[index].notas)) {
                carpetas[index].notas = [];
            }

            // Agregamos la nota y guardamos
            carpetas[index].notas.push(newNotaCarpeta);
            try {
                localStorage.setItem('carpetas', JSON.stringify(carpetas));
                console.log("Carpeta actualizada y guardada en storage:", carpetas[index]);
                toastAlert("success", "Nota guardada en la carpeta");
            } catch (err) {
                console.error("Error guardando carpetas en localStorage:", err);
                toastAlert("info", "Error guardando en localStorage");
                return;
            }

            containerNotas.innerHTML = "";

            const btnAddNote = document.createElement("button");
            btnAddNote.innerHTML = "Añadir tarea a la carpeta";
            btnAddNote.classList.add("btnAddNote");
            btnAddNote.addEventListener("click", () => {
                // importamos de nuevo la carpeta actual desde storage para mantenerla actualizada
                const carpetasActualizadas = obtenerDatoDelStorage('carpetas');
                const carpetaSeleccionadaActual = carpetasActualizadas[index];
                formNuevaNotaCarpeta(carpetaSeleccionadaActual);
            });
            containerNotas.appendChild(btnAddNote);

            // Añadimos las notas guardadas de la carpeta a la UI
            carpetas[index].notas.slice().reverse().forEach(nota => {
                const htmlNote = crearElementoNota(nota);
                containerNotas.appendChild(htmlNote);

            });

            // cerramos el formulario si estaba abierto
            if (containerNotas.querySelector(".form-nueva-nota")) {
                containerNotas.removeChild(containerNotas.querySelector(".form-nueva-nota"));
            }
        }
        formExist = false
    })
}

//  coordina las funciones crearFormularioNota() y manejarSubmitFormulario().
let formExist = false   //variable auxiliar para determinar si ya hay un formulario creado

const formNuevaNota = () => {
    if(formExist){
        const form = containerNotas.querySelector(".form-nueva-nota")
        if(form){
            containerNotas.removeChild(form)
        }
        formExist = false
    }else{
        const formulario = crearFormularioNota();
        formExist = true
        manejarSubmitFormulario(formulario, "nota")

        const btnAddFolder = formulario.form.querySelector(".form-btnCarpeta")

        const formularioCarpeta = crearFormularioCarpeta(); // obtiene el <form> creado
        
        btnAddFolder.addEventListener("click", ()=>{
            let oldform = document.querySelector(".main__notes-container")

            oldform.removeChild(oldform.querySelector(".form-nueva-nota"))

            oldform.append(formularioCarpeta.form);

            manejarSubmitFormulario(formularioCarpeta, "carpeta")
        })

        const btnCancel = formulario.form.querySelector(".form-btnCancel")
        btnCancel.addEventListener("click",()=>{
            containerNotas.removeChild(formulario.form)
            formExist = false
        })
        containerNotas.appendChild(formulario.form)
        
    
    }

}

const formNuevaNotaCarpeta = (carpetaSeleccionada) => {
    if(formExist){
        const form = containerNotas.querySelector(".form-nueva-nota")
        if(form){
            containerNotas.removeChild(form)
        }
        formExist = false
    }else{
        const formulario = crearFormularioNotaParaCarpeta();
        formExist = true
        manejarSubmitFormulario(formulario, "notaDeCarpeta", carpetaSeleccionada)

        const btnCancel = formulario.form.querySelector(".form-btnCancel")
        btnCancel.addEventListener("click",()=>{
            containerNotas.removeChild(formulario.form)
            formExist = false
        })
        containerNotas.appendChild(formulario.form)
    }

}

//  agregamos el evento para que al hacer click en el botón "+" se ejecute la función formNuevaNota.
btnAgregarNota.addEventListener("click", formNuevaNota)

//  función para buscar y retornar los elementos que coincidan con la barra de búsqueda en una lista.
function buscarElementos(arrayHtml, busqueda){
    let arrayNotas = []

    for(let i = 0; i < arrayHtml.length; i++){
        let elemento = arrayHtml[i].querySelector(".main__note-text")

        if(elemento.textContent.startsWith(busqueda)){
            arrayNotas.push(arrayHtml[i])
        }
    }
    
    return arrayNotas
}

//  función para mostrar los elementos buscados, ocultando los que no lo sean.
function mostrarElementosBuscados(array){
    let elementosNoBuscados = []

    for (let i = 0; i < containerNotas.children.length; i++) {
        const elementosTotales = containerNotas.children[i];
        let encontrado = false

        for (let y = 0; y < array.length; y++) {
            const elementoBuscado = array[y].querySelector(".main__note-text").textContent;
            const elementoTotal = elementosTotales.querySelector(".main__note-text").textContent
            
            if (elementoTotal === elementoBuscado) {
                encontrado = true;
                elementosTotales.style.display = "flex";
                break;
            }
        }

        if(!encontrado){
            elementosNoBuscados.push(elementosTotales)
        }
    }
    elementosNoBuscados.forEach(element => {
        element.style.display = "none"
    })
}

//  función para mostrar los elementos originales, ocultos por la función anterior.
function mostrarElementosOriginales(arrayHtml){
    for(let i = 0; i < arrayHtml.length; i++){
        const elemento = arrayHtml[i]
        if(elemento.style.display == "none"){
            elemento.style.display = "flex"
        }
    }
}

//Generamos la función de la barra de búsqueda.
const inputBusqueda = document.getElementById("main__nav-input")

//al escribir en la barra de búsqueda se ejecuta la función que busca y muestra los elementos que coincidan
inputBusqueda.addEventListener("input", ()=>{
    let busqueda = inputBusqueda.value

    busqueda = capitalizeFirstLetter(busqueda)
    
    if(containerNotas.firstElementChild && containerNotas.firstElementChild.tagName === "H1"){
        return
    }else if(busqueda !== ""){
        let elementosBuscados = buscarElementos(notas, busqueda)
        mostrarElementosBuscados(elementosBuscados)
    }else if(busqueda === ""){
        mostrarElementosOriginales(notas)
    }
})

//Botón para ordenar
const containerBtnOrder = document.querySelector(".main__nav-container-order")
const btnOrder = document.querySelector(".main__nav-button-order")
const menuOrder = document.querySelector(".main__nav__order__menu")
const btnOrderAlfabetic = document.querySelector(".main__nav__order__alfabetic")
const btnOrderPriority = document.querySelector(".main__nav__order__priority")
const btnOrderDueDate = document.querySelector(".main__nav__order__dueDate")
let contador = 0

//mostramos el menú de opciones 
btnOrder.addEventListener("click", ()=>{
    //en caso de que se vea lo ocultamos, caso contrario lo mostramos
    if(menuOrder.style.display === "flex"){
        menuOrder.style.display = "none"
    }else{
        menuOrder.style.display = "flex"
    }

    const angle = document.querySelector(".fa-angle-down")
    angle.classList.toggle("fa-angle-down-animation")
})

//Ordenar A-Z
function ordenarAlfabeticamente(arrayHtml){
    const arrayElementos = Array.from(arrayHtml)

    const elementosOrdenados = arrayElementos.sort((a, b) => {
        const textoA = a.querySelector(".main__note-text").textContent.trim().toUpperCase();
        const textoB = b.querySelector(".main__note-text").textContent.trim().toUpperCase();
        
        return textoA.localeCompare(textoB)
    })

    if(arrayHtml.length > 1 && contador === 0){
        while (containerNotas.firstChild){
            containerNotas.removeChild(containerNotas.firstChild);
        }

        elementosOrdenados.forEach(elemento => {
            const nodo = elemento.closest(".main__note");
            containerNotas.appendChild(nodo)
        })
        contador = 1
    }else if(contador === 1){
        while (containerNotas.firstChild){
            containerNotas.removeChild(containerNotas.firstChild);
        }

        cargarNotas()
        contador = 0
    }else{
        return
    }
    
}   
btnOrderAlfabetic.addEventListener("click",()=>{ordenarAlfabeticamente(notas)})

//Ordenar priority
function ordenarPrioridad(arrayHtml){
    const arrayElementos = Array.from(arrayHtml)
    const prioridad = ["low","medium","high"]
    const elementosOrdenados = []

    if(btnOrderPriority.classList.contains("orderSelected")){
        btnOrderPriority.classList.remove("orderSelected")
        
        while (containerNotas.firstChild){
            containerNotas.removeChild(containerNotas.firstChild);
        }

        arrayElementos.reverse()
        arrayElementos.forEach(nota => {containerNotas.appendChild(nota)})
    }else if(!btnOrderPriority.classList.contains("orderSelected")){
        btnOrderPriority.classList.add("orderSelected")
        
        for(let i = 0; i < prioridad.length ; i++){
            const prioridadActual = prioridad[i]

            for(j = 0; j < arrayElementos.length; j++){
                const elemento = arrayElementos[j].querySelector(".note-description-priority")

                if(elemento.textContent.toLowerCase().trim().includes(prioridadActual)){
                    const padreDeElemento = elemento.closest(".main__note")
                    elementosOrdenados.push(padreDeElemento)
                }
            }
        }

        if(arrayHtml.length > 1 && contador === 0){
            while (containerNotas.firstChild){
                containerNotas.removeChild(containerNotas.firstChild);
            }

            elementosOrdenados.reverse()

            elementosOrdenados.forEach(elemento => {
                const nodo = elemento.closest(".main__note");
                containerNotas.appendChild(nodo)
            })
        }else if(contador === 1){
            while (containerNotas.firstChild){
                containerNotas.removeChild(containerNotas.firstChild);
            }

            cargarNotas()
            contador = 0
        }
        
    }
}   
btnOrderPriority.addEventListener("click", ()=>{ordenarPrioridad(notas)})

//Ordenar due date
function ordenarFechaLimite(arrayHtml){
    const arrayElementos = Array.from(arrayHtml)
    const elementosOrdenados = []

    const hoy = new Date()

   arrayElementos.forEach((elemento)=>{
        const elementoFecha = elemento.querySelector(".note-description-date")?.textContent
        if(!elementoFecha) return;

        const fechaElemento = new Date(elementoFecha)

        const nodo = elemento.closest(".main__note")

        if(fechaElemento >= hoy){
            elementosOrdenados.push(nodo)
        }else{
            elementosOrdenados.push(nodo)
        }
    })

    if(arrayHtml.length > 1 && contador === 0){
        while (containerNotas.firstChild){
            containerNotas.removeChild(containerNotas.firstChild);
        }

        elementosOrdenados.sort((a, b) => {
            const fechaA = new Date(a.querySelector(".note-description-date").textContent);
            const fechaB = new Date(b.querySelector(".note-description-date").textContent);
            return fechaA - fechaB; // Ordena de más próxima a más lejana
        });

        elementosOrdenados.forEach(nodo => {
            containerNotas.appendChild(nodo)
        })
        contador = 1
    }else if(contador === 1){
        while (containerNotas.firstChild){
            containerNotas.removeChild(containerNotas.firstChild);
        }

        cargarNotas()
        contador = 0
    }else{

    }
    
}   
btnOrderDueDate.addEventListener("click", ()=>{ordenarFechaLimite(notas)})

//*  --- Pantalla Principal ---
//si no hay tareas agregadas mostramos un mensaje (agregamos un elemento h1)
function mensajeNoTareas(){
    let notas = obtenerDatoDelStorage('notas')

    if (notas.length < 1){
        const msjNoTasks = document.createElement("H1")
        msjNoTasks.innerHTML = "No pending tasks";
        msjNoTasks.classList.add("msjNoTasks")
        containerNotas.appendChild(msjNoTasks)
        containerNotas.style.justifyContent = "center"
    }else{
        containerNotas.style.justifyContent = "stretch"
    }
}


//Función de arrastre de galeria de carpetas
const carrusel = document.querySelector(".main__folders-container");
const carruselInner = document.querySelector(".folders-container");

let isDown = false;
let startX;
let scrollLeft;

carrusel.addEventListener("mousedown", (e) => {
  isDown = true;
  carrusel.classList.add("active");
  startX = e.pageX - carrusel.offsetLeft;
  scrollLeft = carrusel.scrollLeft;
});

carrusel.addEventListener("mouseleave", () => {
  isDown = false;
  carrusel.classList.remove("active");
});

carrusel.addEventListener("mouseup", () => {
  isDown = false;
  carrusel.classList.remove("active");
});

carrusel.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carrusel.offsetLeft;
  const walk = (x - startX) * 2; // multiplicar para velocidad
  carrusel.scrollLeft = scrollLeft - walk;
});


//Cargamos las notas guardadas en el localStorage al iniciar la aplicación.
document.addEventListener("DOMContentLoaded", ()=>{
    inicializarNotas()
    cargarNotas()
    mensajeNoTareas()
    cargarCarpetas()
    
    const elementosCarpetas = containerCarpetas.querySelectorAll(".folder")
    elementosCarpetas.forEach((carpeta)=>{

        const tituloCarpeta = carpeta.querySelector(".folder-title").textContent
        
        carpeta.addEventListener("click",()=>{
            carpeta.classList.toggle("selected")

            //deseleccionamos las otras carpetas iterando sobre ellas y sacando la clase selected
            elementosCarpetas.forEach((otraCarpeta)=>{
                if(otraCarpeta !== carpeta){
                    otraCarpeta.classList.remove("selected")
                }
            })

            if(carpeta.classList.contains("selected")){

                const carpetas = obtenerDatoDelStorage('carpetas')
                //obtenemos la carpeta seleccionada
                let carpetaSeleccionada = carpetas.find(c => c.titulo == tituloCarpeta)

                //limpiamos las notas
                containerNotas.innerHTML=""
                
                const index = carpetas.findIndex(c => (c.titulo || "").trim().toLowerCase() === tituloCarpeta);

                carpetas[index].notas.slice().reverse().forEach(nota => {
                    const htmlNote = crearElementoNota(nota);
                    containerNotas.appendChild(htmlNote);
                });

                const btnAddNote = document.createElement("button")

                containerNav.replaceChild(btnAddNote, btnAgregarNota)

                btnAddNote.innerHTML="Añadir tarea  a la carpeta"
                btnAddNote.classList.add("btnAddNote")
                
                btnAddNote.addEventListener("click",()=>{
                    formNuevaNotaCarpeta(carpetaSeleccionada)
                })

                

                
            }else{
                containerNav.replaceChild(btnAgregarNota, btnAddNote )
                //limpiamos las notas
                containerNotas.innerHTML=""

                //y recargamos las notas originales
                cargarNotas()
            }
        })
        
    })
})