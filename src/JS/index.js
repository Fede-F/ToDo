
import '/src/CSS/style.css'
import './displayController';
import './eventListeners';
import './todoLogic';

import { CreateProject, getTasksFromProjectId, loadProjectList, loadTasktList } from './todoLogic';
import { createProject } from './displayController';


//localStorage.clear();

//Crea un projecto general de ejemplo
const createProjectExample = (() => {
    let newProject = CreateProject('General', '');
    createProject.show_projectList(newProject.projectId, newProject.title);
    getTasksFromProjectId(newProject.projectId);
});


//Si hay datos en la sesion los guardo dentro del array local
if (localStorage.getItem('projects')) {
    loadProjectList();
} else {
    //Sino genero los ejemplos
    createProjectExample();
}

//Si hay datos en la sesion los guardo dentro del array local
if (localStorage.getItem('tasks')) {
    loadTasktList();
}


