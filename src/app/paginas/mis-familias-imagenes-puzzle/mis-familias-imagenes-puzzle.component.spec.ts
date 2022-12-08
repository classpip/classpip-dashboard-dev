import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisFamiliasImagenesPuzzleComponent } from './mis-familias-imagenes-puzzle.component';

describe('MisFamiliasImagenesPuzzleComponent', () => {
  let component: MisFamiliasImagenesPuzzleComponent;
  let fixture: ComponentFixture<MisFamiliasImagenesPuzzleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisFamiliasImagenesPuzzleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisFamiliasImagenesPuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
