import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'formatText'})
export class FormatTextPipe implements PipeTransform {
  private static noteId = 1;

  transform(text: string) {
    // html link (https://regex101.com/r/vYEDZz/2)
    text = text.replace(/(?:\[(.*?)\])?\(?(https?:\/\/[^ \n\r()]+)\)?/gi, (match, $1, $2) => {
      return $1
        ? '<a href="' + $2 + '" title="' + $2 + '" >' + $1 + '</a>'
        : '<a href="' + $2 + '">' + $2 + '</a>';
    });

    // plantuml tag => uml diagram
    text = text.replace(/@startuml((?:.|\n|\r)*?)@enduml/gi, (match, $1) => {
      return '<app-uml code="'+$1+'" diagram="plantuml"></app-uml>';
    });

    // uml sequence tag => uml diagram
    text = text.replace(/@umlseq((?:.|\n|\r)*?)@umlseq/gi, (match, $1) => {
      return '<app-uml code="'+$1+'" diagram="sequence"></app-uml>';
    });

    // uml class tag => uml diagram
    text = text.replace(/@uml((?:.|\n|\r)*?)@uml/gi, (match, $1) => {
      return '<app-uml code="'+$1+'" diagram="class"></app-uml>';
    });

    // "pre-wrap" style to manage space, tab and \n
    return '<div style="white-space: pre-wrap;">'+text+'</div>';
  }

}
