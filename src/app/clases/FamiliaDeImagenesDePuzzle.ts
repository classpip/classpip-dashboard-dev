export class FamiliaDeImagenesDePuzzle {
  NombreFamilia: string;
  Imagenes: string[];
  Publica: boolean;
  profesorId: number;
  id: number;

  constructor(nombreFamilia?: string, imagenes?: string[]) {
    this.NombreFamilia = nombreFamilia;
    this.Imagenes = imagenes;
    this.Publica = false;
  }
}
