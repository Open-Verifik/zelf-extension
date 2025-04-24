import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-welcome-available-content',
  standalone: true,
  imports: [],
  templateUrl: './welcome-available-content.component.html',
  styleUrls: ['./welcome-available-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeAvailableContentComponent { }
