import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionPreguntasJuegoPuzzleComponent } from './asignacion-preguntas-juego-puzzle.component';

describe('AsignacionPreguntasJuegoPuzzleComponent', () => {
  let component: AsignacionPreguntasJuegoPuzzleComponent;
  let fixture: ComponentFixture<AsignacionPreguntasJuegoPuzzleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionPreguntasJuegoPuzzleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionPreguntasJuegoPuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
