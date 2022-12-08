import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDePuzzleSeleccionadoInactivoComponent } from './juego-de-puzzle-seleccionado-inactivo.component';

describe('JuegoDePuzzleSeleccionadoInactivoComponent', () => {
  let component: JuegoDePuzzleSeleccionadoInactivoComponent;
  let fixture: ComponentFixture<JuegoDePuzzleSeleccionadoInactivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDePuzzleSeleccionadoInactivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDePuzzleSeleccionadoInactivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
