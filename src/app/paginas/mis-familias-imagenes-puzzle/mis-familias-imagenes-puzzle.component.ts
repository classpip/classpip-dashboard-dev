import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../../servicios';
import { FamiliaDeImagenesDePuzzle, Profesor, FamiliaAvatares } from 'src/app/clases';
import * as URL from '../../URLs/urls';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mis-familias-imagenes-puzzle',
  templateUrl: './mis-familias-imagenes-puzzle.component.html',
  styleUrls: ['./mis-familias-imagenes-puzzle.component.scss']
})
export class MisFamiliasImagenesPuzzleComponent implements OnInit {
  profesor: Profesor;
  familias: FamiliaDeImagenesDePuzzle[];
  familiasPublicas:  FamiliaDeImagenesDePuzzle[];
  listaFamilias: any[] = [];
  listaFamiliasPublicas: any[] = [];
  dataSource;
  dataSourcePublicas;
  propietarios: string[];
  displayedColumns: string[] = [ 'nombreFamilia', 'ejemplos', 'iconos'];
  displayedColumnsPublicas: string[] = [ 'nombreFamilia', 'ejemplos'];

  constructor(
                private peticionesAPI: PeticionesAPIService,
                private sesion: SesionService,
                private location: Location
  ) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
    this.peticionesAPI.DameFamiliasDeImagenesDePuzzleProfesor (this.profesor.id)
    .subscribe (familias => {
      if (familias.length !== 0) {
        this.familias = familias;
        console.log ('ya tengo las familias de imagenes de puzzle');
        console.log (familias);
        this.familias.forEach (f => {
          const ejemploImagen1 = URL.ImagenesPuzzle + f.Imagenes[0];
          this.listaFamilias.push ({
            familia: f,
            ejemplo1: ejemploImagen1
          });
        });
        console.log ('ya tengo la lista');
        console.log (this.listaFamilias);
        this.dataSource = new MatTableDataSource(this.listaFamilias);
      } else {
        this.familias = undefined;
      }
    });
    this.DameFamiliasDeImagenesDePuzzlePublicas();
  }


  DameFamiliasDeImagenesDePuzzlePublicas() {
    // traigo todas las familias publicas
    this.peticionesAPI.DameFamiliasDeImagenesDePuzzlePublicas()
    .subscribe ( res => {
      console.log ('familias publicas');
      console.log (res);
      if (res[0] !== undefined) {
        // quito las que son del profesor
        this.familiasPublicas = res.filter (familia => familia.profesorId !== this.profesor.id);
        if (this.familiasPublicas.length === 0) {
          this.familiasPublicas = undefined;

        } else {
          this.familiasPublicas.forEach (f => {
            const ejemploImagen1 = URL.ImagenesPuzzle + f.Imagenes[0];
            this.listaFamiliasPublicas.push ({
              familia: f,
              ejemplo1: ejemploImagen1,
            });
          });
          this.dataSourcePublicas = new MatTableDataSource(this.listaFamiliasPublicas);
          this.propietarios = [];
          // Traigo profesores para preparar los nombres de los propietarios
          this.peticionesAPI.DameProfesores()
          .subscribe ( profesores => {
            this.familiasPublicas.forEach (familia => {
              const propietario = profesores.filter (p => p.id === familia.profesorId)[0];
              this.propietarios.push (propietario.Nombre + ' ' + propietario.PrimerApellido);
            });
          });
        }
      }
    });
  }


  BorrarFamilia(familia: FamiliaDeImagenesDePuzzle) {
    this.peticionesAPI.BorrarFamiliaDeImagenesDePuzzle (familia.id)
    .subscribe (() => {
      let cont = 0;
      familia.Imagenes.forEach (imagen => {
        this.peticionesAPI.BorraImagenPuzzle (imagen)
        .subscribe (() => {
          cont++;
          if (cont === familia.Imagenes.length) {
            Swal.fire('OK', 'Imagen de puzzle eliminada', 'success');
            this.listaFamilias = this.listaFamilias.filter (elemento => elemento.familia.id !== familia.id);
            console.log (this.listaFamilias);
            console.log (familia);
            this.dataSource = new MatTableDataSource(this.listaFamilias);
          }
        });
      });
    });
  }
  AdvertenciaBorrar(familia: FamiliaDeImagenesDePuzzle) {
    Swal.fire({
      title: '¿Seguro que quieres eliminar la imagen: ' + familia.NombreFamilia + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.value) {
        this.BorrarFamilia (familia);
      }
    });

  }

  HazPublica(familia: FamiliaDeImagenesDePuzzle) {
    familia.Publica = true;
    this.peticionesAPI.ModificaFamiliaDeImagenesDePuzzle (familia).subscribe();
  }


  HazPrivada(familia: FamiliaDeImagenesDePuzzle) {
    familia.Publica = false;
    this.peticionesAPI.ModificaFamiliaDeImagenesDePuzzle (familia).subscribe();
  }

  goBack() {
    this.location.back();
  }
}
