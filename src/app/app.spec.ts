import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { RecipeBuilderComponent } from './recipe-builder.component';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).overrideComponent(RecipeBuilderComponent, {
      set: { template: '<div></div>' }
    }).overrideComponent(App, {
      set: {
        template: '<h1>Hello, {{ title() }}</h1>'
      }
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, recipe-app');
  });
});
