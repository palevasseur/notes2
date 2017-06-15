import {Component, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-text',
  template: `
    <div #textContent style="white-space: pre-wrap; overflow:hidden;"></div>
  `
})
export class TextComponent implements OnInit {
  @ViewChild('textContent') textContent;
  @Input() text = '';

  constructor() { }

  ngOnInit() {
    this.textContent.nativeElement.innerHTML = this.text;
  }

  /*escapeHtml(text) {
    return text.replace(/[&<>"'\/{}]/g, function (s) {
      var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '/': '&#x2F;',
        '{': '&#123;',
        '}': '&#125;'
      };

      return entityMap[s];
    });
  }*/

}
