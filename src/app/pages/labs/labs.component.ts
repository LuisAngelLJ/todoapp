import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  lista = signal(['Elizabeth', 'Estefania', 'Danna']);
  img = 'https://www.w3schools.com/howto/img_avatar.png';
  name = signal('Angel');
  hidden = true;
  person = signal(
    {
      name: 'luis',
      age: 18
    }
  );

  tasks = signal([
    {
      task: "Leer",
      completed: null
    },
    {
      task: "Escribir",
      completed: null
    }
  ]);

  colorCtrl = new FormControl();

  //valor inical, validaciones
  widthCtrl = new FormControl(80, {
    nonNullable: true
  });

  classCtrl = new FormControl('hola', {
    validators: [
      Validators.required,
      Validators.minLength(4)
    ]
  })

  constructor() {
    this.colorCtrl.valueChanges.subscribe( value => {
      console.log(value);
    });
  }

  clickHandler() {
    console.log("click");
  }

  dblclickHandler() {
    console.log("doble click");
  }

  changeHandler(event: Event) {
    console.log(event);
  }

  keydownHandler(event: KeyboardEvent) {
    //sobre que elemento se precionó
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  signal(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    //cambiar el valor del signal
    this.name.set(newValue);
  }

  changeAge(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update( prevState => {
      return {
        ...prevState,
        age: parseInt(newValue, 10)
      }
    })
  }
}
