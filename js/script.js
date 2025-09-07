
const btnAgregarNota = document.querySelector(".main__nav-button")  //Obtenemos el botón de agregar nota ("+")
const containerNotas = document.querySelector(".main__notes-container") //Obtenemos el contenedor de las notas
const notas = containerNotas.children //Obtenemos las notas que hay en el contenedor

//  función para obtener datos del localStorage, lo usamos para obtener las notas guardadas
const obtenerDatoDelStorage = (name) => {
    let dato = JSON.parse(localStorage.getItem(`${name}`)) || [];
    return dato
}

//  Cargar las notas guardadas en el localStorage al iniciar la aplicación.
const cargarNotas = () => {
    let notas = obtenerDatoDelStorage('notas');

    notas.forEach(nota => {
        const htmlNote = crearElementoNota(nota);
        containerNotas.prepend(htmlNote);
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
                            <button class="main__note__actions__button main__note__actions__button--edit">Edit</button>
                        </div>
                        <div class="actions__container-btns">
                            <button class="main__note__actions__button main__note__actions__button--delete">Delete</button>
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
        const btnNoteEdit = htmlNote.querySelector(".main__note__actions__button--edit")    //Obtenemos el botón de Editar nota
        const btnNoteDelete = htmlNote.querySelector(".main__note__actions__button--delete")    //Obtenemos el botón de Eliminar nota

        //  Asociamos los eventos a los botones
        btnEllipsis.addEventListener("click",()=>{btnEllipsisEvent(ellipsisCont, btnNoteEdit, btnNoteDelete)})
        btnNoteEdit.addEventListener("click",()=>{editNote(htmlNote)})
        btnNoteDelete.addEventListener("click", ()=>{deleteNote(htmlNote)})

        return htmlNote;
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
function btnEllipsisEvent(ellipsisCont, btnNoteEdit, btnNoteDelete){
    ellipsisCont.classList.toggle("menu")

    const isVisible = ellipsisCont.classList.contains("menu")

    if(isVisible){
        requestAnimationFrame(()=>{
            btnNoteEdit.style.maxWidth = "100%"
            btnNoteEdit.style.paddingLeft = "30px"
            btnNoteEdit.style.transform = "scaleX(1)";
            btnNoteEdit.style.opacity = "1";
            
            btnNoteDelete.style.maxWidth = "100%"
            btnNoteDelete.style.paddingLeft = "30px"
            btnNoteDelete.style.transform = "scaleX(1)";
            btnNoteDelete.style.opacity = "1";
            }
        )
    }else{
        btnNoteEdit.style.maxWidth = "0"
        btnNoteEdit.style.paddingLeft = "0"
        btnNoteEdit.style.transform = "scaleX(0)";
        btnNoteEdit.style.opacity = "0";
        
        btnNoteDelete.style.maxWidth = "0"
        btnNoteDelete.style.paddingLeft = "0"
        btnNoteDelete.style.transform = "scaleX(0)";
        btnNoteDelete.style.opacity = "0";
        
    }
}

//  funcion para editar notas
function editNote(note){
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
                <input value="${noteTitle.textContent}" class="note-edit-title">

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
    const dateInput = newNote.querySelector(".note-description-date")
    dateInput.min = new Date().toISOString().split("T")[0] //establecemos la fecha mínima como la fecha actual
    const descripcion = newNote.querySelector(".main__note-description")
    descripcion.style.maxHeight = "none"

    //obtenemos las opciones del elemento select
    
    const newNotePriorityLow = newNote.querySelector(".note-description-priority-low")
    const newNotePriorityMedium = newNote.querySelector(".note-description-priority-medium")
    const newNotePriorityHigh = newNote.querySelector(".note-description-priority-high")

    //comprueba el texto de prioridad de la nota original y marca la opcion correspondiente en el select del neuvo form
    if(notePriority.textContent.includes("low")){
        newNotePriorityLow.setAttribute("selected", "selected")
    }else if(notePriority.textContent.includes("medium")){
        newNotePriorityMedium.setAttribute("selected", "selected")
    }else if(notePriority.textContent.includes("high")){
        newNotePriorityHigh.setAttribute("selected", "selected")
    }

    
    const newCheck = newNote.querySelector(".note-edit-checkbox")
    let estadoFinalCheckbox = noteCheck.checked

    newCheck.addEventListener("change", ()=>{
        estadoFinalCheckbox = newCheck.checked
    })
    
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
        notas = notas.map(nota => {
            if (capitalizeFirstLetter(nota.titulo) === noteTitle.textContent) {
                noteTitle.innerHTML = newNote.querySelector(".note-edit-title").value
                noteDescription.innerHTML = newNote.querySelector(".note-edit-description").value
                notePriority.innerHTML = `Priority: ${newNote.querySelector(".note-description-priority").value}`
                noteDate.textContent = newNote.querySelector(".note-description-date").value
                noteCheck.checked = estadoFinalCheckbox;

                return {
                    titulo: noteTitle.textContent,
                    descripcion: noteDescription.textContent,
                    fecha: noteDate.textContent,
                    prioridad: newNote.querySelector(".note-description-priority").value
                };
            }
        })
        localStorage.setItem('notas', JSON.stringify(notas));
    })
    containerNotas.replaceChild(newNote, note)
}

//  funcion para eliminar nota
function deleteNote(note){
    const des = confirm("Are you sure you want to delete the note?")
    if(des){
        let notasArr = JSON.parse(localStorage.getItem('notas')) || [];

        notasArr = notasArr.filter(nota => capitalizeFirstLetter(nota.titulo) !== note.querySelector(".main__note-text").textContent);
        localStorage.setItem('notas', JSON.stringify(notasArr));

        for (let i = 0; i < notas.length; i++) {
            if(notas[i] === note){
                containerNotas.removeChild(notas[i])
                mensajeNoTareas()
            }
        }
    }else{
        console.log("se canceló la operación")
    }
}

//  función para tranformar primera letra en mayúscula
const capitalizeFirstLetter = (str) =>{
    return str.charAt(0).toUpperCase() + str.slice(1)
}

//  Encargada solo de crear y retornar el <form>, sin insertarlo en el DOM. retorna diccionario {form,inputTitulo, textAreaDeDescripcion, inputFecha, selectPrioridad, btnCancel, btnSubmit}
const crearFormularioNota = () => {
    //Nuevo formulario
    const form = document.createElement("form")
    form.classList.add("form-nueva-nota")

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

    //Añadimos los campos al formulario
    form.append(inputTitulo)
    form.append(textAreaDeDescripcion)
    form.append(contFormFooter)

    return {form,inputTitulo, textAreaDeDescripcion, inputFecha, selectPrioridad, btnCancel, btnSubmit};
}

//  Asocia el evento de submit al formulario, obtiene los datos, crea la nota y la agrega al contenedor.
const manejarSubmitFormulario = (formulario) => {

    let form = formulario.form
    let inputTitulo = form.querySelector("#titulo");
    let textArea = form.querySelector("#descripcion");
    let inputFecha = form.querySelector("#fecha");
    let selectPrioridad = form.querySelector("#prioridad");

    form.addEventListener("submit",(e)=>{
        e.preventDefault();

        const newNota = {
            titulo: inputTitulo.value, 
            descripcion: textArea.value, 
            fecha: inputFecha.value, 
            prioridad: selectPrioridad.value
        };

        // Guardamos la nota en el localStorage
        let notas = JSON.parse(localStorage.getItem('notas')) || [];
        notas.push(newNota);
        localStorage.setItem('notas', JSON.stringify(notas));

        //si existe el mensaje "No pending tasks" en pantalla los borramos
        let msj = document.querySelector(".msjNoTasks")
        if (containerNotas.contains(msj)){
            containerNotas.removeChild(msj)
            containerNotas.style.display = "flex";
            containerNotas.style.justifyContent = "stretch"
        }

        const htmlNote = crearElementoNota(newNota);
        containerNotas.appendChild(htmlNote);

        containerNotas.removeChild(form);
        formExist = false
    });


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
        manejarSubmitFormulario(formulario)

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
mensajeNoTareas()

//Cargamos las notas guardadas en el localStorage al iniciar la aplicación.
document.addEventListener("DOMContentLoaded", cargarNotas)