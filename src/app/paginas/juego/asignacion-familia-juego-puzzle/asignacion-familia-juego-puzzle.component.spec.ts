import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionFamiliaJuegoPuzzleComponent } from './asignacion-familia-juego-puzzle.component';

describe('AsignacionFamiliaJuegoPuzzleComponent', () => {
  let component: AsignacionFamiliaJuegoPuzzleComponent;
  let fixture: ComponentFixture<AsignacionFamiliaJuegoPuzzleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionFamiliaJuegoPuzzleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionFamiliaJuegoPuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
