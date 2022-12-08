import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFamiliaImagenesPuzzleComponent } from './crear-familia-imagenes-puzzle.component';

describe('CrearFamiliaImagenesPuzzleComponent', () => {
  let component: CrearFamiliaImagenesPuzzleComponent;
  let fixture: ComponentFixture<CrearFamiliaImagenesPuzzleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearFamiliaImagenesPuzzleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearFamiliaImagenesPuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
