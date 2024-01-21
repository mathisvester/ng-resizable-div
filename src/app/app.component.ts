import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResizableDivComponent } from './resizable-div/resizable-div.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ResizableDivComponent],
  template: `<app-resizable-div />`,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
