import { Component, computed, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/tasks.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  //lisa de tareas que deben seguir los atributos de Tasks
  tasks = signal<Task[]>([]);

  filter = signal('all');
  //computed state
  //crear señal en base a otras
  tasksByFilter = computed( () => {
    //leer estado deñ filtro actual
    const filter = this.filter();
    //leer lista de tareas
    const tasks = this.tasks();
    //computed creara un nuevo estado a partir de los estados que esto vigilando dentro de esta funcion
    // clacular un nuevo estado
    if(filter === 'pending') {
      return tasks.filter(task => !task.completed);//tareas no completadas
    }
    if(filter === 'completed') {
      return tasks.filter(task => task.completed);//tareas completadas
    }
    return tasks;
  } )

  //lo que recibe es, valor por defcto, 
  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  });

  constructor() {
    //vigila un estado y ejecuta una acció o logica
    effect(() => {//guardar el array de tareas
      //cada qye una tarea cambie voy a guardar en el localStorage
      const tasks = this.tasks();
      console.log("Run effect");
      localStorage.setItem('tasks', JSON.stringify(tasks));
    })
  }

  ngOnInit(): void {
    //leer el array detareas almacenadas en localStorage
    const localTasks = localStorage.getItem('tasks');
    if(localTasks) {
      this.tasks.set( JSON.parse(localTasks) );
    }
  }

  //recibe el valor para las tareas
  newValuesTasks() {
    if(this.newTaskCtrl.valid && this.newTaskCtrl.value.trimStart().trimEnd() != '') {
      const value = this.newTaskCtrl.value;
      this.addTasks(value);
      //limpiar el input
      this.newTaskCtrl.setValue('');
    }
  }

  //agregar tareas
  addTasks(title: string) {
    const newTasks = {
      id: Date.now(),
      title,
      completed: false
    }
    //agregar tareas
    this.tasks.update( tasks => [...tasks, newTasks]);
  }

  //recibo la posicion para elimianr
  deleteTasks(index: number) {
    //listar las posiciones que sean diferente al index que pasamos
    this.tasks.update( tasks => tasks.filter( (task, position) => position !== index ));
  }

  //actualizar a tarea completada
  updateTasks(index: number) {
    this.tasks.update( tasks => {
      return tasks.map( (task, position) => {
        if(position === index) {
          return {
            ...task,
            completed: !task.completed //si es false pasa a true y su es true pasa a false
          }
        }

        return task;
      })
    });
  }


  //1.- editar sobreponer el inpu de edicón, para eso agregue una propiedad opcional en el modelo
  updateTaskEditingMode(index: number) {
    this.tasks.update( prevState => {
      return prevState.map( (task, position) => {
        if(position === index) {
          return {
            ...task,
            editing: true
          }
          console.log(task.editing);
        }
        //para editar solo una y que al editar otra me desactive la anterior
        return {... task, editing: false};
      })
    })
  }

  //2.- editar el valor de el titulo
  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update( prevState => {
      return prevState.map( (task, position) => {
        if(position === index) {
          return {
            ...task,
            title: input.value,
            editing: false
          }
          console.log(task.editing);
        }
        return task;
      })
    })
  }

  changeFilter(filter: string) {
    this.filter.set(filter)
  }
}
