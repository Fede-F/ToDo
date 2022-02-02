import { createProject, removeAllChildNodes, showListOfProjects, showTasksfromList, markCheckbox } from './displayController';

var projectId = 1;
var taskId = 1;
let projectList = [];
let taskList = [];

class project {
    constructor(title) {
        this.projectId = projectId++;
        this.title = title;
    };
    //Agrega el nuevo proyecto a la lista
    addProject(newProject) {
        projectList.push(newProject)
    };
};

class task {
    constructor(title, projectId, priority, dueDate, description, done) {
        this.taskId = taskId++;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.done = done;
    }

    //Agrega la nueva tarea  a la lista
    addTask(newTask) {
        taskList.push(newTask)
    };

    get allTasks() {
        return this.taskList
    }
};

//Funciones para las tareas
function CreateTask(title, projectId, priority, dueDate, description, done) {
    let newTask = new task(title, projectId, priority, dueDate, description, done);
    newTask.addTask(newTask);
    saveTasktoLocalStore();
    return newTask;

};

function getTasksFromProjectId(projectId) {
    if (projectId != '') {
        for (var i = 0; i < taskList.length; i++) {
            if (taskList[i].projectId === projectId) {
                showTasksfromList(taskList[i].taskId, taskList[i].title, taskList[i].projectId, taskList[i].description, taskList[i].priority, taskList[i].dueDate, taskList[i].done);
                markCheckbox(taskList[i].taskId, taskList[i].done);
            }
        }
    }
    else {
        //Cuando se recarga la pagina, ,carga solamente las tareas del proyecto General
        for (var i = 0; i < taskList.length; i++) {
            if (taskList[i].projectId === '1') {
            taskId++;
            showTasksfromList(taskList[i].taskId, taskList[i].title, taskList[i].projectId, taskList[i].description, taskList[i].priority, taskList[i].dueDate, taskList[i].done);
            markCheckbox(taskList[i].taskId, taskList[i].done);
            }
        }

    }

}

function checkDoneTask(taskId, check) {
    taskList.forEach(element => {
        if (element.taskId === parseInt(taskId)) {
            element.done = check;
            saveTasktoLocalStore();
        }
    });
}

function deleteTaskfromArray(taskId) {
    taskList.forEach((element, index) => {
        if (element.taskId === parseInt(taskId)) {
            taskList.splice(index, 1);
            saveTasktoLocalStore();
        }
    });
}

//Elimina todas las tareas del proyecto eliminado
function deleteProjectsTasksfromArray(projectId) {
    taskList.forEach((element, index) => {
        if (element.projectId === parseInt(projectId)) {
            taskList.splice(index, 1);
            saveTasktoLocalStore();
        }
    });
}

function saveTasktoLocalStore() {
    localStorage.setItem("tasks", JSON.stringify(taskList));

}

function loadTasktList() {
    taskList = JSON.parse(localStorage.getItem('tasks'));
    getTasksFromProjectId('');
}

//Funciones para los proyectos
function CreateProject(title) {
    let newProject = new project(title);
    newProject.addProject(newProject);
    savetoProjectLocalStore();
    return newProject;
};

function ShowListProject(task_projectId) {
    removeAllChildNodes(task_projectId);
    projectList.forEach(element => {
        showListOfProjects(element.title, element.projectId);
    });
}

function deleteProjectfromArray(projectId) {
    projectList.forEach((element, index) => {
        if (element.projectId === parseInt(projectId)) {
            projectList.splice(index, 1);
            savetoProjectLocalStore()
        }
    });
}

function getProjectTitlefromProjectId(projectId) {
    //forEach no retorna un valor, se resuelve de esta manera
    for (var i = 0; i < projectList.length; i++) {
        if (projectList[i].projectId === parseInt(projectId)) {
            return projectList[i].title;
        }
    }
}

function refreshProjectstoList() {
    projectList.forEach(element => {
        projectId++;
        createProject.show_projectList(element.projectId, element.title);
    });
}

function savetoProjectLocalStore() {
    localStorage.setItem("projects", JSON.stringify(projectList));

}



function loadProjectList() {
    projectList = JSON.parse(localStorage.getItem('projects'));
    refreshProjectstoList();
}



export { CreateTask, CreateProject, ShowListProject, getTasksFromProjectId, checkDoneTask, deleteTaskfromArray, deleteProjectfromArray, deleteProjectsTasksfromArray, getProjectTitlefromProjectId, refreshProjectstoList, loadProjectList, loadTasktList };
