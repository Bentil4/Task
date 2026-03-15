import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DialogService } from './core/services/dialog.service';
import { provideRouter } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let dialogService: DialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        DialogService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.inject(DialogService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should inject DialogService', () => {
    expect(component.dialogService).toBe(dialogService);
  });

  it('should render router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should render notification component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const notification = compiled.querySelector('app-notification');
    expect(notification).toBeTruthy();
  });
});
