import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadosService } from './services/estados/estados.service'
import { PaisesService } from './services/paises/paises.service'
import { PersonaService } from './services/persona/persona.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  personaForm: FormGroup;
  paises: any;
  estados: any;
  personas: any;

  constructor(
    public fb: FormBuilder,
    public estadosService: EstadosService,
    public paisesService: PaisesService,
    public personaService: PersonaService,
  ) {

  }

  ngOnInit(): void {
    this.personaForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      identificacion: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      pais: ['', Validators.required],
      estado: ['', Validators.required],
    })

    this.paisesService.getAllPaises().subscribe(resp => {
      this.paises = resp;
    },
      error => { console.error(error) }
    )

    this.personaService.getAllPersonas().subscribe(resp => {
      this.personas = resp;
    },
      error => { console.error(error) }
    );

    this.personaForm.get("pais").valueChanges.subscribe(value => {
      this.estadosService.getAllEstadosByPais(value.id).subscribe(resp => {
        this.estados = resp;
      },
        error => { console.error(error) }
      )
    })
  }

  guardar(): void {
    const dateSendingToServer = new DatePipe('en-US')
      .transform(this.personaForm.value.fecha_nacimiento, 'dd/MM/yyyy')
    this.personaForm.value.fecha_nacimiento = dateSendingToServer;

    this.personaService.savePersona(this.personaForm.value).subscribe(resp => {
      this.personaForm.reset();
      this.personas = this.personas.filter(persona => resp.id !== persona.id)
      this.personas.push(resp);
    },
      error => { console.error(error) }
    )
  }

  eliminar(persona) {
    this.personaService.deletePersona(persona.id).subscribe(resp => {
      if (resp) {
        this.personas.pop(persona)
      }
    })
  }

  editar(persona) {
    var newdate = persona.fecha_nacimiento.split("/").reverse().join("-");

    this.personaForm.setValue({
      id: persona.id,
      nombre: persona.nombre,
      edad: persona.edad,
      identificacion: persona.identificacion,
      fecha_nacimiento: newdate,
      pais: persona.pais,
      estado: persona.estado,
    })
  }


}
