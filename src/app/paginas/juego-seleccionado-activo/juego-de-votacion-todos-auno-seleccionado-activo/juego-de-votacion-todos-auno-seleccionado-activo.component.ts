import { TablaEquipoJuegoDeVotacionTodosAUno } from './../../../clases/TablaEquipoJuegoDeVotacionTodosAUno';
import { EquipoJuegoDeVotacionTodosAUno } from 'src/app/clases/EquipoJuegoDeVotacionTodosAUno';
import { Component, OnInit } from '@angular/core';
// Servicio
import { SesionService, PeticionesAPIService, CalculosService, ComServerService } from '../../../servicios/index';
import Swal from 'sweetalert2';
// Clases
import { TablaAlumnoJuegoDeVotacionTodosAUno} from '../../../clases/index';
import {JuegoDeVotacionTodosAUno, Alumno,Equipo, AlumnoJuegoDeVotacionTodosAUno} from '../../../clases/index';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Howl } from 'howler';

@Component({
  selector: 'app-juego-de-votacion-todos-auno-seleccionado-activo',
  templateUrl: './juego-de-votacion-todos-auno-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-votacion-todos-auno-seleccionado-activo.component.scss']
})
export class JuegoDeVotacionTodosAUnoSeleccionadoActivoComponent implements OnInit {
  juegoSeleccionado: any;
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeVotacionTodosAUno[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeVotacionTodosAUno[];
  rankingIndividualJuegoDeVotacionTodosAUno: TablaAlumnoJuegoDeVotacionTodosAUno[] = [];
  rankingEquiposJuegoDeVotacionTodosAUno: TablaEquipoJuegoDeVotacionTodosAUno[] = [];
  datasourceAlumno;
  datasourceEquipo;
  alumnosEquipo: Alumno[];

  // tslint:disable-next-line:max-line-length
  columnasListas = false;

  displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'votos',  'nota'];
  displayedColumnsEquipos: string[] = ['posicion', 'nombreEquipo', 'miembros', 'nota', 'votos', 'cuantos'];

  interval;
  alumnosQueYaHanVotado: Alumno[];
  equiposQueYaHanVotado: number[];
  equiposConMiembros: any;



  //  /** Table columns */
  //  columns = [
  //   { columnDef: 'posicion',    header: 'Posición',       cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.posicion}`        },
  //   { columnDef: 'nombreAlumno',  header: 'Nombre',     cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.nombre}`      },
  //   // tslint:disable-next-line:max-line-length
  //   { columnDef: 'primerApellido',  header: 'Primer Apellido', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.primerApellido}` },
  //   // tslint:disable-next-line:max-line-length
  //   { columnDef: 'segundoApellido',  header: 'Segundo Apellido', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.segundoApellido}` },
  //   { columnDef: 'nota',  header: 'Nota', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.nota}` },
  //   { columnDef: 'votos',  header: 'Votos recibidos', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.votosRecibidos}` },
  //   { columnDef: 'C1',  header: 'C1', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.conceptos[0]}` }
  //   // { columnDef: ' ',  header: ' ', cell: (row: TablaAlumnoJuegoDeVotacionTodosAUno) => `${row.votado}` }
  // ];

  // /** Column definitions in order */
  // displayedColumnsAlumnos = this.columns.map(x => x.columnDef);

  constructor(
    public sesion: SesionService,
    public peticionesAPI: PeticionesAPIService,
    public calculos: CalculosService,
    private comServer: ComServerService,
    private location: Location) { }

  ngOnInit() {
    const sound = new Howl({
      src: ['/assets/got-it-done.mp3']
    });
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);
    if (this.juegoSeleccionado.Modo =="Individual"){
      if (this.juegoSeleccionado.Conceptos.length > 1) {
        // Si solo hay un concepto entonces no añado nuevas columnas porque en la tabla solo se mostrará
        // la nota final y no la nota del concepto, que es la misma que la nota final.
        this.juegoSeleccionado.Conceptos.forEach (concepto => this.displayedColumnsAlumnos.push (concepto));
      }
      this.displayedColumnsAlumnos.push (' ');
  
      this.columnasListas = true;
      console.log ('columnas');
      console.log (this.displayedColumnsAlumnos);
      console.log ('conceptos');
      console.log (this.juegoSeleccionado.Conceptos);

    }else{
      if (this.juegoSeleccionado.Conceptos.length > 1) {
        // Si solo hay un concepto entonces no añado nuevas columnas porque en la tabla solo se mostrará
        // la nota final y no la nota del concepto, que es la misma que la nota final.
        this.juegoSeleccionado.Conceptos.forEach (concepto => this.displayedColumnsEquipos.push (concepto));
      }
      this.displayedColumnsEquipos.push (' ');
  
      this.columnasListas = true;
      console.log ('columnas');
      console.log (this.displayedColumnsEquipos);
      console.log ('conceptos');
      console.log (this.juegoSeleccionado.Conceptos);
    }



    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
      this.comServer.EsperoVotaciones()
      .subscribe((res: any) => {
          sound.play();
          // Recupero las inscripciones de la base de datos para actualizar la tabla
          this.RecuperarInscripcionesAlumnoJuego();
      });
    } else {
        this.EquiposDelJuego();
        console.log ('VOY A ESPERAR VOTACION');
        this.comServer.EsperoVotacion()
        .subscribe((res: any) => {
            sound.play();
            this.RecuperarInscripcionesEquipoJuego();
      });
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


  AlumnoHaVotado(alumno: Alumno) {
    return this.alumnosQueYaHanVotado.some (al => al.id === alumno.id);
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
      this.TablaClasificacionTotal();
    });
  }

  RecuperarInscripcionesEquipoJuego(){
    console.log ('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
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

  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:max-line-length
      this.rankingIndividualJuegoDeVotacionTodosAUno = this.calculos.PrepararTablaRankingIndividualVotacionTodosAUno (
        this.listaAlumnosOrdenadaPorPuntos,
        this.alumnosDelJuego,
        this.juegoSeleccionado);
      // tslint:disable-next-line:only-arrow-functions
      this.rankingIndividualJuegoDeVotacionTodosAUno = this.rankingIndividualJuegoDeVotacionTodosAUno.sort(function(obj1, obj2) {
        return obj2.nota - obj1.nota;
      });
      console.log ('inscripciones');
      console.log (this.listaAlumnosOrdenadaPorPuntos);
      console.log ('ranking');
      console.log (this.rankingIndividualJuegoDeVotacionTodosAUno);
      this.datasourceAlumno = new MatTableDataSource(this.rankingIndividualJuegoDeVotacionTodosAUno);

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
      this.datasourceEquipo = new MatTableDataSource(this.rankingEquiposJuegoDeVotacionTodosAUno);


    }
  }


  VotacionFinalizada() {
    // Miro si todos han votado
    console.log('votacionfinalizada funcion');
    console.log(this.juegoSeleccionado.Modo);
    console.log(this.juegoSeleccionado.VotanEquipos);
    console.log(this.juegoSeleccionado);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      let cont = 0;
      this.rankingIndividualJuegoDeVotacionTodosAUno.forEach (al => {if (al.votado) { cont++; } });
      console.log(cont === this.rankingIndividualJuegoDeVotacionTodosAUno.length);
      return (cont === this.rankingIndividualJuegoDeVotacionTodosAUno.length);
    } else if (this.juegoSeleccionado.VotanEquipos) {
      let cont = 0;
      this.rankingEquiposJuegoDeVotacionTodosAUno.forEach (eq => {if (eq.votado) { cont++; } });
      console.log(cont === this.rankingEquiposJuegoDeVotacionTodosAUno.length);
      return (cont === this.rankingEquiposJuegoDeVotacionTodosAUno.length);
    } else if (this.juegoSeleccionado.Modo === 'Equipos' && !this.juegoSeleccionado.VotanEquipos){
      console.log(this.alumnosQueYaHanVotado.length === this.alumnosDelJuego.length);
      return (this.alumnosQueYaHanVotado.length === this.alumnosDelJuego.length);
    }else{
      console.log('error');
    }
  }

  DesactivarJuego() {
    Swal.fire({
      title: '¿Seguro que quieres desactivar el juego de votación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        // Primero registro las puntuaciones definitivas de cada alumno
        if(this.juegoSeleccionado.Modo=='Indivual'){
          this.listaAlumnosOrdenadaPorPuntos.forEach (alumno => {
            alumno.PuntosTotales = this.rankingIndividualJuegoDeVotacionTodosAUno.filter (al => al.id === alumno.alumnoId)[0].nota;
            console.log ('actualizo');
            console.log (alumno);
            this.peticionesAPI.ModificaInscripcionAlumnoJuegoDeVotacionTodosAUno (alumno).subscribe();
          });
        }else{
          this.listaEquiposOrdenadaPorPuntos.forEach (equipo => {
            equipo.PuntosTotales = this.rankingEquiposJuegoDeVotacionTodosAUno.filter (eq => eq.id === equipo.equipoId)[0].nota;
            console.log ('actualizo');
            console.log (equipo);
            this.peticionesAPI.ModificaInscripcionEquipoJuegoDeVotacionTodosAUno (equipo).subscribe();
          });
        }

        this.juegoSeleccionado.JuegoActivo = false;
        this.peticionesAPI.CambiaEstadoJuegoDeVotacionTodosAUno (this.juegoSeleccionado)
        .subscribe(res => {
            if (res !== undefined) {
              console.log(res);
              console.log('juego desactivado');
              Swal.fire('El juego se ha desactivado correctamente');
              this.location.back();
            }
        });
      }
    });
  }

  CuantosHanVotadoDelEquipo (equipo: Equipo): string {
    // Hay que contar cuantos alumnos del equipo están en la lista de los que ya han votado
    // Primero vemos si todas las listas implicadas están preparadas
    if (this.equiposConMiembros && this.alumnosQueYaHanVotado) {
      const alumnosDelEquipo = this.equiposConMiembros.filter (eq => eq.equipo.id === equipo.id)[0].miembros;
      console.log ('equipo ', equipo);
      console.log ('alumnos del equipo ', alumnosDelEquipo);
      console.log ('alumnos que ya han votado ', this.alumnosQueYaHanVotado);
      const yaHanVotado = alumnosDelEquipo.filter(alumno => this.alumnosQueYaHanVotado.some(al => al.id === alumno.id));
      console.log ('ya han votado ', yaHanVotado);
      if (yaHanVotado) {
        return yaHanVotado.length + '/' + alumnosDelEquipo.length;
      } else {
        return '0/' + alumnosDelEquipo.length;
      }
    } else {
      return null
    }

  }

  applyFilter(filterValue: string) {
    if(this.juegoSeleccionado.Modo== 'Individual'){
      this.datasourceAlumno.filter = filterValue.trim().toLowerCase();
    }else{
      this.datasourceEquipo.filter = filterValue.trim().toLowerCase();
    }
  }

}
