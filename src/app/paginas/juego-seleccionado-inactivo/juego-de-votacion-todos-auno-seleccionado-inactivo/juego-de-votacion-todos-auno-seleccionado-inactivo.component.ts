import { Component, OnInit } from '@angular/core';

import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';
import Swal from 'sweetalert2';
import {JuegoDeVotacionTodosAUno, Alumno, AlumnoJuegoDeVotacionTodosAUno, TablaAlumnoJuegoDeVotacionTodosAUno, Equipo, TablaEquipoJuegoDeVotacionTodosAUno, EquipoJuegoDeVotacionTodosAUno} from '../../../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

@Component({
  selector: 'app-juego-de-votacion-todos-auno-seleccionado-inactivo',
  templateUrl: './juego-de-votacion-todos-auno-seleccionado-inactivo.component.html',
  styleUrls: ['./juego-de-votacion-todos-auno-seleccionado-inactivo.component.scss']
})
export class JuegoDeVotacionTodosAUnoSeleccionadoInactivoComponent implements OnInit {
  juegoSeleccionado: any;
  alumnosDelJuego: Alumno[]=[];  
  equiposDelJuego: Equipo[]=[];
  alumnosEquipo: Alumno[]=[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionTodosAUno[]=[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeVotacionTodosAUno[]=[];
  rankingIndividualJuegoDeVotacionTodosAUno: TablaAlumnoJuegoDeVotacionTodosAUno[] = [];
  rankingEquiposJuegoDeVotacionTodosAUno: TablaEquipoJuegoDeVotacionTodosAUno[] = [];
  dataSourceAlumno;
  dataSourceEquipo;

  // tslint:disable-next-line:max-line-length
  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'votos',  'nota'];
  displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'nota', 'votos'];
  equiposConMiembros: any[]=[];

  columnasListas =false;

  constructor(
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public calculos: CalculosService,
    private location: Location
  ) { }


  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);


    if (this.juegoSeleccionado.Modo === 'Individual') {
      
      if (this.juegoSeleccionado.Conceptos.length > 1) {
        // Si solo hay un concepto entonces no añado nuevas columnas porque en la tabla solo se mostrará
        // la nota final y no la nota del concepto, que es la misma que la nota final.
        this.juegoSeleccionado.Conceptos.forEach (concepto => this.displayedColumnsAlumnos.push (concepto));
      }
      this.AlumnosDelJuego();
    } else {
      
      if (this.juegoSeleccionado.Conceptos.length > 1) {
        // Si solo hay un concepto entonces no añado nuevas columnas porque en la tabla solo se mostrará
        // la nota final y no la nota del concepto, que es la misma que la nota final.
        this.juegoSeleccionado.Conceptos.forEach (concepto => this.displayedColumnsEquipos.push (concepto));
      }
      this.columnasListas = true;
      this.EquiposDelJuego();
    }
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
      console.log ('Vamos a pos los alumnos');
      this.peticionesAPI.DameAlumnosJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id)
      .subscribe(alumnosJuego => {
        console.log ('Ya tengo los alumnos');
        console.log(alumnosJuego);
        this.alumnosDelJuego = alumnosJuego;
        this.RecuperarInscripcionesAlumnoJuego();
      });
  }

  async EquiposDelJuego() {

    // Voy a necesitar a los alumnos del grupo
    this.peticionesAPI.DameAlumnosGrupo(this.juegoSeleccionado.grupoId)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos');
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      console.log ('Vamos a pos los equipos');
      this.peticionesAPI.DameEquiposJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id)
      .subscribe(equiposJuego => {
        console.log ('Ya tengo los equipos');
        console.log(equiposJuego);
        this.equiposDelJuego = equiposJuego;
        this.equiposConMiembros = [];
        this.equiposDelJuego.forEach (async eq => {
          const res = await this.peticionesAPI.DameAlumnosEquipo (eq.id).toPromise();
          if (res !== undefined) {
            this.equiposConMiembros.push ({
              equipo: eq,
              miembros: res
            })
          } else {
            this.equiposConMiembros.push ({
              equipo: eq,
              miembros: undefined
            })
          }

        })
      
        this.RecuperarInscripcionesEquipoJuego();
      });  
    });
  
  }

  RecuperarInscripcionesAlumnoJuego() {
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      console.log ('inscripciones');
      console.log (this.listaAlumnosOrdenadaPorPuntos);
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      // this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      //   return obj2.puntosTotales - obj1.puntosTotales;
      // });
      this.TablaClasificacionTotal();
    });
  }

  RecuperarInscripcionesEquipoJuego(){
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      console.log("inscipciones",inscripciones);
      /*for(let i=0; i<this.listaEquiposOrdenadaPorPuntos.length; i++){
        if(this.listaEquiposOrdenadaPorPuntos[i]){
          for(let b=0; b<this.listaEquiposOrdenadaPorPuntos[i].VotosEmitidos[b].lenght; b++){
            var found =false;
            for (let c=0; c<this.alumnosDelJuego.length && !found; c++){
              if (this.listaEquiposOrdenadaPorPuntos[i].VotosEmitidos[b].id === this.alumnosDelJuego[c].id){
                found=true;
                this.alumnosQueYaHanVotado.push(this.alumnosDelJuego[c]);
              }
            }
          }
        }
      }*/
      this.TablaClasificacionTotal();
    });

  }


  async AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    const res = await this.peticionesAPI.DameAlumnosEquipo (equipo.id).toPromise();
    if (res[0] !== undefined) {
        this.alumnosEquipo = res;
    } else {
      console.log('No hay alumnos en este equipo');
      // Informar al usuario
      this.alumnosEquipo = undefined;
    }
  }


  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:max-line-length
      this.rankingIndividualJuegoDeVotacionTodosAUno = this.calculos.PrepararTablaRankingIndividualVotacionTodosAUnoAcabado (
        this.listaAlumnosOrdenadaPorPuntos,
        this.alumnosDelJuego,
        this.juegoSeleccionado);
      // tslint:disable-next-line:only-arrow-functions
      this.rankingIndividualJuegoDeVotacionTodosAUno = this.rankingIndividualJuegoDeVotacionTodosAUno.sort(function(obj1, obj2) {
        return obj2.nota - obj1.nota;
      });
      this.dataSourceAlumno = new MatTableDataSource(this.rankingIndividualJuegoDeVotacionTodosAUno);

    } else {
      // tslint:disable-next-line:max-line-length
      this.rankingEquiposJuegoDeVotacionTodosAUno = this.calculos.PrepararTablaRankingEquiposVotacionTodosAUno (
        this.listaEquiposOrdenadaPorPuntos,
        this.equiposDelJuego,
        this.juegoSeleccionado);
      // tslint:disable-next-line:only-arrow-functions
      this.rankingEquiposJuegoDeVotacionTodosAUno = this.rankingEquiposJuegoDeVotacionTodosAUno.sort(function(obj1, obj2) {
        return obj2.nota - obj1.nota;
      });
      console.log ('inscripciones');
      console.log (this.listaEquiposOrdenadaPorPuntos);
      console.log ('ranking');
      console.log (this.rankingEquiposJuegoDeVotacionTodosAUno);
      this.dataSourceEquipo = new MatTableDataSource(this.rankingEquiposJuegoDeVotacionTodosAUno);



    }
  }

  Eliminar() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar el juego de votación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then(async (result) => {
      if (result.value) {
        await this.calculos.EliminarJuegoDeVotacionTodosAUno(this.juegoSeleccionado);
        Swal.fire('El juego se ha eliminado correctamente');
        this.location.back();
      }
    });
  }

  Reactivar() {
    Swal.fire({
      title: '¿Seguro que quieres activar el juego de votación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {

        this.juegoSeleccionado.JuegoActivo = true;
        this.peticionesAPI.CambiaEstadoJuegoDeVotacionTodosAUno (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              Swal.fire('El juego se ha activado correctamente');
              this.location.back();
            }
        });
      }
    });
  }


  applyFilter(filterValue: string) {
    if(this.juegoSeleccionado.Modo== 'Individual'){
      this.dataSourceAlumno.filter = filterValue.trim().toLowerCase();
    }else{
      this.dataSourceEquipo.filter = filterValue.trim().toLowerCase();
    }
  }


}
