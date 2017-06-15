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
    let text = this.text;

    text = this.escapeHtml(text);

    // html link (https://regex101.com/r/vYEDZz/2)
    text = text.replace(/(?:\[(.*?)\])?\(?(https?:\/\/[^ \n\r()]+)\)?/gi, (match, $1, $2) => {
      return $1
        ? '<a href="' + $2 + '" title="' + $2 + '" >' + $1 + '</a>'
        : '<a href="' + $2 + '">' + $2 + '</a>';
    });

    this.textContent.nativeElement.innerHTML = text;
  }

  escapeHtml(text) {
    return text.replace(/[&<>"'{}]/g, function (s) {
      var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
//        '/': '&#x2F;',
        '{': '&#123;',
        '}': '&#125;'
      };

      return entityMap[s];
    });
  }

}
