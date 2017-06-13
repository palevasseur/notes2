import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-text',
  template: `
    <div #textContent style="white-space: pre-wrap; overflow:hidden;">{{name}}</div>
    <button (click)="display('text changed')">change text</button>
  `
})
export class TextComponent implements OnInit {
  // dynamic component => binding not supported (http://stackoverflow.com/questions/39745819/angular-2-is-it-possible-to-bind-a-var-in-a-dynamic-component?rq=1)
  @ViewChild('textContent') textContent;
  name = 'Text component';

  constructor() { }

  ngOnInit() {
  }

  display(text: string) {
    this.textContent.nativeElement.innerHTML = text;
  }
}
