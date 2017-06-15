import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'formatText'})
export class FormatTextPipe implements PipeTransform {

  transform(text: string) {
    // plantuml tag => uml diagram
    text = text.replace(/@startuml((?:.|\n|\r)*?)@enduml/gi, (match, $1) => {
      return '<app-uml code="' + this.escapeQuote($1) + '" diagram="plantuml"></app-uml>';
    });

    // uml sequence tag => uml diagram
    text = text.replace(/@umlseq((?:.|\n|\r)*?)@umlseq/gi, (match, $1) => {
      return '<app-uml code="' + this.escapeQuote($1) + '" diagram="sequence"></app-uml>';
    });

    // uml class tag => uml diagram
    text = text.replace(/@uml((?:.|\n|\r)*?)@uml/gi, (match, $1) => {
      return '<app-uml code="' + this.escapeQuote($1) + '" diagram="class"></app-uml>';
    });

    // text class tag
    text = text.replace(/@text((?:.|\n|\r)*?)@text/gi, (match, $1) => {
      return '<app-text text="' + this.escapeQuote($1) + '"></app-text>';
    });


    return text;
  }

  escapeQuote(text) {
    return text.replace(/["]/g, function (s) {
      return '&quot;';
    });
  }

}
