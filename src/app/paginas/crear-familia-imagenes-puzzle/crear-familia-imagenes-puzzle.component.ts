import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
// Servicios
import { SesionService, PeticionesAPIService } from '../../servicios/index';
import {FamiliaDeImagenesDePuzzle, Profesor} from '../../clases';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crear-familia-imagenes-puzzle',
  templateUrl: './crear-familia-imagenes-puzzle.component.html',
  styleUrls: ['./crear-familia-imagenes-puzzle.component.scss']
})
export class CrearFamiliaImagenesPuzzleComponent implements OnInit {

  nombreFamilia: string;
  advertencia = true;
  ficherosFamilia;
  profesor: Profesor;

  imagenesCargadas = false;
  imagenFamilia: string;

  constructor(
        private peticionesAPI: PeticionesAPIService,
        private sesion: SesionService,
        private router: Router
  ) { }

  ngOnInit() {
    this.profesor = this.sesion.DameProfesor();
  }

  CrearFamilia() {
    document.getElementById('inputImagenes').click();
  }




  SeleccionarFicherosFamilia($event) {
    this.ficherosFamilia = Array.from($event.target.files);
    // Ya tenemos todos los ficheros de las imagenes
    // preparo la primera imagen de la familia como muestra
    const file = $event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      console.log('ya he cargado la imagen de la coleccion');
      this.imagenesCargadas = true;
      this.imagenFamilia = reader.result.toString();
    };

  }

  RegistrarFamilia() {
    const imagenes = [];
    let cont = 0;
    this.ficherosFamilia.forEach(imagen => {
      const formData = new FormData();
      imagenes.push (imagen.name);
      formData.append(imagen.name, imagen);
      this.peticionesAPI.PonImagenPuzzle(formData)
      .subscribe(() => {
        cont++;
        if (cont === this.ficherosFamilia.length) {
          const familia = new FamiliaDeImagenesDePuzzle (this.nombreFamilia, imagenes);
          console.log ('familia ');
          console.log (familia);
          this.peticionesAPI.CreaFamiliaDeImagenesDePuzzle (familia, this.profesor.id)
          .subscribe ( () => {
            Swal.fire('OK', 'Recurso creado', 'success');
            this.router.navigate(['/inicio/' + this.profesor.id]);
          });
        }
      });
    });

  }
  Cancelar() {
    this.router.navigate(['/inicio/' + this.profesor.id]);
  }


}
