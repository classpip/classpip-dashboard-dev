import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SesionService, CalculosService, PeticionesAPIService, ComServerService } from '../../servicios/index';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

// tslint:disable-next-line:max-line-length
import { CuestionarioSatisfaccion, JuegoDeEncuestaRapida, TablaPuntosFormulaUno,
          JuegoDeVotacionRapida } from '../../clases/index';

import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';


export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

export interface ChipColor {
  nombre: string;
  color: ThemePalette;
}

@Component({
  selector: 'app-crear-juego-rapido',
  templateUrl: './crear-juego-rapido.component.html',
  styleUrls: ['./crear-juego-rapido.component.scss']
})
export class CrearJuegoRapidoComponent implements OnInit {
  profesorId: number;


  // tslint:disable-next-line:ban-types
  juegoCreado: Boolean = false;

  // Usaré esta variable para determinar si debo advertir al usuario de
  // que está abandonando el proceso de creación del juego
  creandoJuego = false;

  juego: any;


  // Informacion para todos los juegos
  myForm: FormGroup;
  nombreDelJuego: string;
  tipoDeJuegoSeleccionado: string;

  tengoNombre = false;
  tengoTipo = false;

  seleccionTipoJuego: ChipColor[] = [
    {nombre: 'Juego De Encuesta Rápida', color: 'primary'},
    {nombre: 'Juego De Cuestionario Rápido', color: 'accent'},
    {nombre: 'Juego De Votación Rápida', color: 'warn'}
  ];




  // Información para el juego de cuestionario de satisfacción
  cuestionarioSatisfaccion: CuestionarioSatisfaccion;
  tengoCuestionarioSatisfaccion = false;


  // Información para el juego de votacion rápida
  listaConceptos: string [] = [];
  dataSourceConceptos;
  conceptosAsignados = false;
  nuevaPuntuacion: number;
  tengoNuevaPuntuacion = false;
  selection = new SelectionModel<any>(true, []);
  dataSource;

  displayedColumnsConceptos: string[] = ['concepto', ' '];

  Puntuacion: number[] = [];

  TablaPuntuacion: TablaPuntosFormulaUno[];
  displayedColumnsTablaPuntuacion: string[] = ['select', 'Posicion', 'Puntos'];



  constructor(
    private calculos: CalculosService,
    private sesion: SesionService,
    private comService: ComServerService,
    private location: Location,
    private peticionesAPI: PeticionesAPIService,
    // tslint:disable-next-line:variable-name
    private _formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {

    this.profesorId = this.sesion.DameProfesor().id;
    this.myForm = this._formBuilder.group({
      NombreDelJuego: ['', Validators.required],
      Concepto: ['', Validators.required],
      NuevaPuntuacion: ['', Validators.required]
    });

    this.TablaPuntuacion = [];
    this.TablaPuntuacion[0] = new TablaPuntosFormulaUno(1, 10);
    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.Puntuacion[0] = 10;

    this.listaConceptos = [];

  }

  GuardaNombreDelJuego() {
    this.nombreDelJuego = this.myForm.value.NombreDelJuego;
    if ( this.nombreDelJuego === undefined) {
      this.tengoNombre = false;
    } else {
      this.tengoNombre = true;
      this.creandoJuego = true; // empiezo el proceso de creacion del juego
    }
  }


  TipoDeJuegoSeleccionado(tipo: ChipColor) {
    if (tipo.nombre === 'Juego De Cuestionario Rápido') {
      Swal.fire('Alerta', 'Aún no es posible el juego de cuestionario rápido', 'warning');
    } else {
      this.tipoDeJuegoSeleccionado = tipo.nombre;
      this.tengoTipo = true;
    }
  }


  RecibeCuestionarioSatisfaccionElegido($event) {
    this.cuestionarioSatisfaccion = $event;
    this.tengoCuestionarioSatisfaccion = true;
  }

  CrearJuegoDeEncuestaRapida() {

    // genero una clave aleatoria de 8 digitos en forma de string
    const clave = Math.random().toString().substr(2, 8);
    const juegoDeEncuestaRapida = new JuegoDeEncuestaRapida (
      this.nombreDelJuego,
      this.tipoDeJuegoSeleccionado,
      clave,
      this.profesorId,
      this.cuestionarioSatisfaccion.id
    );
    console.log ('voy a crear juego');
    console.log (juegoDeEncuestaRapida);
    this.peticionesAPI.CreaJuegoDeEncuestaRapida (juegoDeEncuestaRapida)
    .subscribe (juegoCreado => {
      this.juego = juegoCreado;

      this.juegoCreado = true;
      Swal.fire('Juego de encuesta rápida creado correctamente', ' ', 'success');
      this.goBack();
    });
  }



PonConcepto() {
  this.listaConceptos.push (this.myForm.value.Concepto);
  this.dataSourceConceptos = new MatTableDataSource (this.listaConceptos);
  this.myForm.reset();
}


BorraConcepto(concepto) {
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < this.listaConceptos.length; i++) {
    if (this.listaConceptos[i] === concepto) {
      this.listaConceptos.splice ( i, 1);
    }
  }
  this.dataSourceConceptos = new MatTableDataSource (this.listaConceptos);
}

AsignarConceptos() {
  this.conceptosAsignados = true;
}

GuardarNuevaPuntuacion() {
  this.nuevaPuntuacion = Number (this.myForm.value.NuevaPuntuacion);
  this.tengoNuevaPuntuacion = true;

}

Preparado() {
  if ((this.tengoNuevaPuntuacion) &&  (this.selection.selected.length > 0)) {
    return true;
  } else {
    return false;
  }
}

AnadirPuntos() {
  console.log ('nueva puntuiacion');
  console.log (this.nuevaPuntuacion);
  if (!isNaN(this.nuevaPuntuacion)) {
    for ( let i = 0; i < this.dataSource.data.length; i++) {
      // Buscamos los alumnos que hemos seleccionado
      if (this.selection.isSelected(this.dataSource.data[i]))  {
        this.Puntuacion[i] = this.nuevaPuntuacion;
        this.TablaPuntuacion[i].Puntuacion = this.nuevaPuntuacion;
      }
    }
  } else {
       Swal.fire('Introduzca una puntuación válida', 'Le recordamos que debe ser un Número', 'error');
  }
  this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
  this.selection.clear();
  this.tengoNuevaPuntuacion = false;
}

AnadirFila() {

  let i: number;
  i = this.Puntuacion.length;

  this.TablaPuntuacion[i] = new TablaPuntosFormulaUno(i + 1, 1);
  this.Puntuacion[i] = this.TablaPuntuacion[i].Puntuacion;
  this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
}

EliminarFila() {

  let i: number;
  i = this.Puntuacion.length;
  console.log(i);
  console.log(this.Puntuacion);
  if (i > 1) {
        this.TablaPuntuacion = this.TablaPuntuacion.splice(0, i - 1);
        this.Puntuacion = this.Puntuacion.slice(0, i - 1);
        console.log(this.TablaPuntuacion);
        console.log(this.Puntuacion);

        this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
  } else {
    Swal.fire('No es posible eliminar otra fila', 'Como mínimo debe haber una', 'error');
  }

}

IsAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

/* Cuando se clica en el checkbox de cabecera hay que ver si todos los
  * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
  * desactivado, en cuyo caso se activan todos */

MasterToggle() {
  if (this.IsAllSelected()) {
    this.selection.clear(); // Desactivamos todos
  } else {
    // activamos todos
    this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
CrearJuegoDeVotacionRapida () {
  console.log ('voy a crear un juego de votacion rápida');
  const clave = Math.random().toString().substr(2, 8);
  const juegoDeVotacionRapida = new JuegoDeVotacionRapida (
    this.nombreDelJuego,
    this.tipoDeJuegoSeleccionado,
    clave,
    this.profesorId,
    this.listaConceptos,
    this.Puntuacion
  );
  console.log ('voy a crear un juego de votacion rápida');
  console.log (juegoDeVotacionRapida);
  this.peticionesAPI.CreaJuegoDeVotacionRapida (juegoDeVotacionRapida)
  .subscribe (juegoCreado => {
    this.juego = juegoCreado;

    this.juegoCreado = true;
    Swal.fire('Juego de votación rápida creado correctamente', ' ', 'success');
    this.goBack();
  });


}

  goBack() {
    this.router.navigate(['/inicio/' + this.profesorId]);
  }

}
