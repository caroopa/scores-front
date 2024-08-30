import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  @Input() loading: boolean = false;
  @Input() connectionError: boolean = false;
}
