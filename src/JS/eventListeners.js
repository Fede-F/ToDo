import { createTask, createProject, selectTasksFromProject, checkTask, deleteTask, raise_deleteProjectConfirm_popup, deleteProjectConfirm_popup, hide_deleteProjectConfirm_popup, expandTaskDetails } from './displayController';

//Eventos para las tareas
createTask.btn_newTask.addEventListener('click', createTask.show_taskCreation_Popup);
createTask.btn_saveTask.addEventListener('click', createTask.submit_newTask);
createTask.btn_cancelTask.addEventListener('click', createTask.hide_taskCreation_Popup);
//Evento cuando se tilda o destilda una tarea
createTask.tasks_list_container.addEventListener('click', checkTask);
//Evento cuando se elimina una tarea
createTask.tasks_list_container.addEventListener('click', deleteTask);
//Evento al clickear el boton de tareas para expandir
createTask.tasks_list_container.addEventListener('click', expandTaskDetails);

/*
for (i = 0; i < createTask.btn_taskCollapse.length; i++) {
    createTask.btn_taskCollapse[i].addEventListener('click', function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
*/
//Eventos para los proyectos
createProject.btn_newProject.addEventListener('click', createProject.show_projectCreation_Popup);
createProject.btn_saveProject.addEventListener('click', createProject.submit_newProject);
createProject.btn_cancelProject.addEventListener('click', createProject.hide_projectCreation_Popup);
//Evento cuando se clickea un proyecto
createProject.projects_list_container.addEventListener('click', selectTasksFromProject);
//Evento cuando se clickea eliminar un proyecto
createProject.projects_list_container.addEventListener('click', raise_deleteProjectConfirm_popup);
//Evento cuando se confirma la eliminacion del proyecto
createProject.btn_projectDelete_confirm.addEventListener('click', deleteProjectConfirm_popup);
createProject.btn_cancel_projectDelete.addEventListener('click', hide_deleteProjectConfirm_popup);