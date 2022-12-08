export class JuegoPUZZLE {

        NombreJuego: string;
        Tipo: string;
        Modo: string;
        JuegoActivo: boolean;
        id: number;
        grupoId: number;
        Puntos: number[];
        Tiempo: number;
        Dificultad: string;
        NombreImagen: string;
        preguntaId: string;
      
        constructor(Tipo?: string, Modo?: string, JuegoActivo?: boolean, Puntos?: number[], NombreJuego?: string, Tiempo?: number, Dificultad?: string, NombreImagen?: string, preguntaId?: string) {
        this.Tipo = Tipo;
        this.Modo = Modo;
        this.JuegoActivo = JuegoActivo;
        this.Puntos = Puntos;
        this.NombreJuego = NombreJuego;
        this.Tiempo = Tiempo;
        this.Dificultad = Dificultad;
        this.NombreImagen = NombreImagen;
        this.preguntaId = preguntaId;
        }
}