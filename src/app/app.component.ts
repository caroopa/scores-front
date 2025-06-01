import { Component, inject } from '@angular/core';
import { MaterialModule } from './material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
// components
import { GeneralComponent } from './components/general/general.component';
import { InstructorsComponent } from './components/instructors/instructors.component';
import { CompetitorComponent } from './components/competitor/competitor.component';
import { TrophiesComponent } from './components/trophies/trophies.component';
// services
import { GeneralService } from './services/general.service';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MaterialModule,
    GeneralComponent,
    InstructorsComponent,
    CompetitorComponent,
    TrophiesComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  selectedFile: File | null = null;
  isLoading = false;

  private _snackBar = inject(MatSnackBar);

  constructor(
    private generalService: GeneralService,
    private sharedService: SharedService
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.name.toLowerCase().endsWith('.csv')) {
        this._snackBar.open('Sólo se permiten archivos CSV.', 'Cerrar', {
          duration: 3000,
        });
        input.value = ''; 
        return;
      }

      this.isLoading = true;

      this.generalService.uploadData(file).subscribe({
        next: () => {
          this._snackBar.open('Datos cargados correctamente', 'Cerrar', {
            duration: 3000,
          });
          this.sharedService.upload();
        },
        error: (error) => {
          console.error('Error en la carga: ', error);
          this._snackBar.open('Error en la carga del archivo', 'Cerrar', {
            duration: 3000,
          });
        },
        complete: () => {
          this.isLoading = false;
          input.value = '';
        },
      });
    }
  }
}
