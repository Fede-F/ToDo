import { CreateTask, CreateProject, ShowListProject, getTasksFromProjectId, checkDoneTask, deleteTaskfromArray, deleteProjectfromArray, deleteProjectsTasksfromArray, getProjectTitlefromProjectId, refreshProjectstoList } from './todoLogic';
import { format, parseISO } from 'date-fns';

const createTask = (() => {
    //Popups
    const newTask_popup = document.getElementById('newTask_modal')

    //Buttons
    const btn_newTask = document.getElementById('btn_newTask');
    const btn_saveTask = document.getElementById('btn_save_Task');
    const btn_cancelTask = document.getElementById('btn_cancel_Task');

    //Inputs
    const inpt_task_name = document.getElementById('task_name');
    const inpt_task_projectId = document.getElementById('task_projectId');
    const inpt_task_priority = document.getElementById('task_priority');
    const inpt_task_due_date = document.getElementById('task_due_date');
    const inpt_task_description = document.getElementById('task_description');

    //Containers
    const tasks_list_container = document.getElementById('listTodo_div');

    function show_taskCreation_Popup() {
        newTask_popup.style.visibility = "visible";
        newTask_popup.style.opacity = "1";
        ShowListProject(inpt_task_projectId);
    }

    function hide_taskCreation_Popup() {
        newTask_popup.style.visibility = "hidden";
        newTask_popup.style.opacity = "0";
    }

    function submit_newTask() {
        // Select Values
        const inpt_task_projectId_value = inpt_task_projectId.options[inpt_task_projectId.selectedIndex].value;
        const inpt_task_priority_value = inpt_task_priority.options[inpt_task_priority.selectedIndex].value;
        if (inpt_task_name.value != "") {
            let duedate
            if (inpt_task_due_date.value != '') duedate = format(parseISO(inpt_task_due_date.value), 'dd/MM/yy');
            else duedate = '';
            //Crea y obtiene el nuevo objeto projecto
            CreateTask(inpt_task_name.value, inpt_task_projectId_value, inpt_task_priority_value, duedate, inpt_task_description.value, false);
            hide_taskCreation_Popup();
            setProjectActive(inpt_task_projectId_value);
        }
    }

    return {
        btn_newTask,
        btn_saveTask,
        btn_cancelTask,
        show_taskCreation_Popup,
        hide_taskCreation_Popup,
        submit_newTask,
        inpt_task_projectId,
        tasks_list_container,

    };
})();

const createProject = (() => {
    //Popups
    const newProject_popup = document.getElementById('newProject_modal')
    const deleteProjectConfirm_popup = document.getElementById('projectDeleteConfirmation_modal')

    //Buttons
    const btn_newProject = document.getElementById('btn_newProject');
    const btn_saveProject = document.getElementById('btn_save_project');
    const btn_cancelProject = document.getElementById('btn_cancel_project');
    const btn_projectDelete_confirm = document.getElementById('btn_projectDelete_confirm');
    const btn_cancel_projectDelete = document.getElementById('btn_cancel_projectDelete');

    //Inputs
    const inpt_Projectname = document.getElementById('project_name');

    //Containers
    //Se obtiene el container donde se van a mostrar la lista de projectos
    const projects_list_container = document.getElementById('projects_list');

    //Text
    const txt_projectName_title = document.getElementById('projectName_title');

    //Project Functions
    function show_projectCreation_Popup() {
        newProject_popup.style.visibility = "visible";
        newProject_popup.style.opacity = "1";
    };

    function hide_projectCreation_Popup() {
        inpt_Projectname.value = "";
        newProject_popup.style.visibility = "hidden";
        newProject_popup.style.opacity = "0";
    };

    //Carga la lista de proyectos
    function show_projectList(projectId, projectTitle) {
        let content
        //Evita que el proyecto general se pueda eliminar
        if (projectId === 1) {
            content = `
            <div id="project_${projectId}" class="project_container" >
                <button id="${projectId}" type="button" class="project_btn" name="${projectTitle}">${projectTitle}</button>
            </div>
            `;
        } else {
            content = `
        <div id="project_${projectId}" class="project_container">
            <div class="project_button_container" >
                <button id="${projectId}" type="button" class="project_btn" name="${projectTitle}">${projectTitle}</button>
            </div>
            <button id="delete_project_${projectId}" type="button" class="delete_project_btn" value="${projectId}">x</button>
        </div>
        `;
        }
        // Agrega el elemento creado al div
        projects_list_container.innerHTML += content;
    }

    function submit_newProject() {
        if (inpt_Projectname.value != "") {
            //Crea y obtiene el nuevo objeto projecto
            let newProject = CreateProject(inpt_Projectname.value);
            let projectId = newProject.projectId;
            show_projectList(projectId, inpt_Projectname.value);
            inpt_Projectname.value = "";
            hide_projectCreation_Popup();
        }
    }

    return {
        newProject_popup,
        btn_newProject,
        btn_saveProject,
        btn_cancelProject,
        projects_list_container,
        show_projectCreation_Popup,
        hide_projectCreation_Popup,
        deleteProjectConfirm_popup,
        btn_projectDelete_confirm,
        btn_cancel_projectDelete,
        show_projectList,
        submit_newProject,
        txt_projectName_title,
    };
})();

//Funciones para las tareas
//Accion al clickear un proyecto en la lista de proyectos
function selectTasksFromProject(event) {
    let element = event.target;
    if (element.className === "project_btn") {
        setProjectActive(element.id)
    }
}

//Muestra la lista de tareas del proyecto seleccionado
function showTasksfromList(taskId, title, projectId, description, priority, dueDate, done) {
    let content = `
    <div id="task_${taskId}_div" class="task_item">
        <input class="check-input" type="checkbox" id="check_task_${taskId}" value="${taskId}" >
        <button id="task_${taskId}"  type="button" class="collapsible">${title}</button>
        <p id="task_${taskId}_priority" class="task_priority_txt">${priority}</p>
        <p class="task_duedate_txt">${dueDate}</p>
        <button id="delete_task_${taskId}" type="button" class="delete_task_btn" value="${taskId}" name="${projectId}">x</button>
    </div>
    <div id="desc_task_${taskId}" class="task_desc">
        <p id="taskDesc_txt">${description}</p>
    </div>
    `;

    // Agrega el elemento creado al div
    createTask.tasks_list_container.innerHTML += content;
    //Cambio el color de acuerdo a la prioridad
    changeColorPriority("task_" + taskId + "_priority", priority);
    //Marco la tarea si esta hecha
    let task_element = document.getElementById("task_" + taskId);
    markElements(task_element, done);

}

function changeColorPriority(element, priority) {
    let task_detail_element = document.getElementById(element);
    if (priority === "Bajo") {
        task_detail_element.style.color = "rgb(78 169 78)";
        task_detail_element.style.backgroundColor = "#d2fdd2";
    }
    else if (priority === "Medio") {
        task_detail_element.style.color = "#ebb621";
        task_detail_element.style.backgroundColor = "rgb(255 239 193)"
    }
    else if (priority === "Alto") {
        task_detail_element.style.color = "#ed2020cf";
        task_detail_element.style.backgroundColor = "rgb(253 222 222 / 81%)"
    }
}


//Accion que realiza cuando se tilda una tarea
function checkTask(event) {
    let element = event.target;
    if (element.className === "check-input") {
        checkDoneTask(element.value, element.checked);
        let task_element = document.getElementById("task_" + element.value);
        markElements(task_element, element.checked);
    }
}

function deleteTask(event) {
    let element = event.target;
    if (element.className === "delete_task_btn") {
        deleteTaskfromArray(element.value);
        //Obtengo el projectoId para actualizar su lista de tareas
        let projectId = element.getAttribute("name");
        //Vacia y muestra el proyecto activo donde se creo la tarea
        removeAllChildNodes(createTask.tasks_list_container);
        getTasksFromProjectId(projectId);
    }
}

function expandTaskDetails(event) {
    let element = event.target;
    if (element.className === "collapsible") {
        //element.classList.toggle("active");
        let desc_content = document.getElementById("desc_" + element.id)
        if (desc_content.style.maxHeight) {
            desc_content.style.maxHeight = null;
        } else {
            desc_content.style.maxHeight = desc_content.scrollHeight + "px";
        }
    }
}

//Funciones para proyectos
//Muestra la lista de projectos en el desplegable de creacion de tareas
function showListOfProjects(project_name, project_id) {
    let project_option = document.createElement("option");
    project_option.textContent = project_name;
    project_option.value = project_id;
    createTask.inpt_task_projectId.appendChild(project_option);

};

function setProjectActive(projectId) {
    removeAllChildNodes(createTask.tasks_list_container);
    let projectTitle = getProjectTitlefromProjectId(projectId);
    changeNametoActiveProject(projectTitle);
    getTasksFromProjectId(projectId);
}

//Cambia el nombre del titulo al proyecto activo
function changeNametoActiveProject(projectTitle) {
    createProject.txt_projectName_title.textContent = projectTitle;
}

function raise_deleteProjectConfirm_popup(event) {
    let element = event.target;
    if (element.className === "delete_project_btn") {
        show_deleteProjectConfirm_popup(element.value);
    }
}

function show_deleteProjectConfirm_popup(projectId) {
    createProject.deleteProjectConfirm_popup.style.visibility = "visible";
    createProject.deleteProjectConfirm_popup.style.opacity = "1";
    createProject.btn_projectDelete_confirm.value = projectId;
};

function hide_deleteProjectConfirm_popup() {
    createProject.deleteProjectConfirm_popup.style.visibility = "hidden";
    createProject.deleteProjectConfirm_popup.style.opacity = "0";
};

function deleteProjectConfirm_popup(event) {
    let element = event.target;
    if (parseInt(element.value) !== 1) {
        deleteProjectfromArray(element.value);
        deleteProjectsTasksfromArray(element.value);
        //Vacia la lista de proyectos creados
        removeAllChildNodes(createProject.projects_list_container);
        refreshProjectstoList();
        setProjectActive('1');
    }
    hide_deleteProjectConfirm_popup()
}

//Funciones generales
//Borra los nodos hijos
function removeAllChildNodes(parent) {
    //Elimino la lista para que no duplique elementos
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//Marca visualmente los elementos
function markElements(element, check) {
    if (check) {
        element.style.textDecoration = "line-through";
        element.style.color = "#888";
    } else {
        element.style.textDecoration = "";
        element.style.color = "#000000";
    }
}
//Marca la casilla
function markCheckbox(element_id, check) {
    let check_element = document.getElementById("check_task_" + element_id);
    if (check) {
        //De esta manera se muestra tildado al actualizar
        check_element.setAttribute('checked',true)

    } else {
        check_element.checked = false;
    } 
}



export { createTask, createProject, showListOfProjects, removeAllChildNodes, selectTasksFromProject, showTasksfromList, checkTask, deleteTask, raise_deleteProjectConfirm_popup, deleteProjectConfirm_popup, hide_deleteProjectConfirm_popup, expandTaskDetails,markCheckbox };

