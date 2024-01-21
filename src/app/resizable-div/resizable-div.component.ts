import { ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild, } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { fromEvent, scan, Subject, switchMap } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

type AnchorPosition = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

type BoxStyle = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const initialBoxStyle: BoxStyle = {
  top: 100,
  left: 100,
  width: 100,
  height: 100,
};

@Component({
  selector: 'app-resizable-div',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (boxStyle$ | async; as boxStyle) {
      <div
        #box
        class="box"
        [ngStyle]="{ 'top.px': boxStyle.top, 'left.px': boxStyle.left, 'width.px': boxStyle.width, 'height.px': boxStyle.height }">
        <div (mousedown)="anchorClick$$.next({ e: $event, mode: 'top-left' })" class="anchor-top-left"></div>
        <div (mousedown)="anchorClick$$.next({ e: $event, mode: 'top-right' })" class="anchor-top-right"></div>
        <div (mousedown)="anchorClick$$.next({ e: $event, mode: 'bottom-right' })" class="anchor-bottom-right"></div>
        <div (mousedown)="anchorClick$$.next({ e: $event, mode: 'bottom-left' })" class="anchor-bottom-left"></div>
      </div>
    }
  `,
  styleUrls: ['./resizable-div.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizableDivComponent {
  @ViewChild('box')
  box!: ElementRef<HTMLDivElement>;

  readonly anchorClick$$ = new Subject<{
    e: MouseEvent;
    mode: AnchorPosition;
  }>();

  readonly mouseUp$ = fromEvent(this.document, 'mouseup');

  readonly boxStyle$ = this.anchorClick$$.pipe(
    switchMap(({ mode }) =>
      fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
        map((e) => this.handleResize(e, mode)),
        takeUntil(this.mouseUp$)
      )
    ),
    scan((acc, value) => {
      return {
        ...acc,
        ...(value.width >= this.maxWidth && {
          left: value.left,
          width: value.width,
        }),
        ...(value.height >= this.maxHeight && {
          top: value.top,
          height: value.height,
        }),
      };
    }, initialBoxStyle),
    startWith(initialBoxStyle)
  );

  private readonly maxHeight = 40;
  private readonly maxWidth = 40;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  private handleResize(e: MouseEvent, mode: AnchorPosition): BoxStyle {
    const { right, bottom, top, left, width, height } =
      this.box.nativeElement.getBoundingClientRect();

    switch (mode) {
      case 'top-left':
        return {
          top: e.clientY,
          left: e.clientX,
          width: width + left - e.clientX,
          height: height + top - e.clientY,
        };
      case 'top-right':
        return {
          top: e.clientY,
          left,
          width: width + e.clientX - right,
          height: height + top - e.clientY,
        };
      case 'bottom-right':
        return {
          top,
          left,
          width: width + e.clientX - right,
          height: height + e.clientY - bottom,
        };
      case 'bottom-left':
        return {
          top,
          left: e.clientX,
          width: width + left - e.clientX,
          height: height + e.clientY - bottom,
        };
    }
  }
}
