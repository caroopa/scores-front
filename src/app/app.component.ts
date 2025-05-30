import { Component } from '@angular/core';
import { MaterialModule } from './material.module';
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

  constructor(
    private generalService: GeneralService,
    private sharedService: SharedService
  ) {}

  onFileSelected(event: Event) {
    // TODO: VALIDAR FORMATO

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isLoading = true;

      this.generalService.uploadData(file).subscribe({
        next: () => {
          console.log('Archivo cargado correctamente.');
        },
        error: (error) => {
          console.error('Error en la carga: ', error);
        },
        complete: () => {
          this.sharedService.upload();
          this.isLoading = false;
          input.value = '';
          // TODO: CARTEL DE ÉXITO
        },
      });
    }
  }
}
