import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDePuzzleSeleccionadoActivoComponent } from './juego-de-puzzle-seleccionado-activo.component';

describe('JuegoDePuzzleSeleccionadoActivoComponent', () => {
  let component: JuegoDePuzzleSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDePuzzleSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDePuzzleSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDePuzzleSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
