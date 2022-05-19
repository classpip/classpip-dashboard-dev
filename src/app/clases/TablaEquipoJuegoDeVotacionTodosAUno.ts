export class TablaEquipoJuegoDeVotacionTodosAUno {

  posicion: number;
  nombre: string;
  nota: number;
  id: number; // equipoId
  votado: boolean;
  votosRecibidos: number;
  conceptos: number[];

  constructor(posicion?: number, nombre?: string,
              nota?: number, id?: number) {

    this.posicion = posicion;
    this.nombre = nombre;
    this.nota = nota;
    this.id = id;
    this.votosRecibidos = 0;
    this.votado = false;
  }
}
