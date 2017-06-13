import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {plantUrl} from "../utils/plantuml";

@Component({
  selector: 'app-uml',
  template: `
    <div>
      <textarea [(ngModel)]="code" (keyup)="codeChanged();"></textarea>
      <img #umlImg/>
    </div>
  `
})
export class UmlComponent implements OnInit, AfterViewInit {
  private static noteId = 1;
  @Input() code = '';
  @Input() diagram = 'class';
  @ViewChild('umlImg') umlImg;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.draw();
  }

  // delay code changes
  private lastCode = '';
  private lastTimeout = null;
  codeChanged() {
    if(this.code != this.lastCode) {
      this.lastCode = this.code;
      if(this.lastTimeout!=null) {
        window.clearTimeout(this.lastTimeout);
      }

      let _this = this;
      this.lastTimeout = window.setTimeout(function() { _this.draw(); }, 1000);
    }
  }

  public draw(noteCode?: string, diagram?: string) {
    if(noteCode) {
      this.code = noteCode;
    }

    if(diagram) {
      this.diagram = diagram;
    }

    if(!this.code) {
      return;
    }

    switch (this.diagram) {
      case 'plantuml':
      {
        this.umlImg.nativeElement.src = plantUrl(this.code);
        break;
      }
      case 'sequence':
      {
        let plantumlCode = this.diagramSequence(this.code);
        this.umlImg.nativeElement.src = plantUrl(plantumlCode);
        break;
      }
      case 'class':
      {
        let plantumlCode = this.diagramClass(this.code);
        this.umlImg.nativeElement.src = plantUrl(plantumlCode);
        break;
      }
    }
  }

  /*
   AbstractCacheManager <<abstract>>
   refresh()
   refreshIndex() {abstract}

   ComminglingCacheManager
   refreshIndex()
   --|> AbstractCacheManager
   ..> RcsIndexer
   --> "1" File
   */
  private diagramClass(code) {
    let plantCode = `
skinparam handwritten true
hide footbox
hide empty fields
hide empty methods
`;
    let $currentClass = '';
    code.split('\n').forEach(line => {
      // set current class def
      [, $currentClass=$currentClass] = line.match(/^([a-zA-Z]+)/) || [];

      // no tab => class name def
      // tab => class properties
      // class name => plantuml not need it
      // class with abstract prop => plantuml need to define
      [
        { regex: /^([a-zA-Z]+) *(<<\w+>>)/,
          compute: (line, className) => (line)
        },
        { regex: /^ +(\w+)/,
          compute: (line, className) => (className + ' : ' + line)
        },
        { regex: /^ +(\.\.>) +/,
          compute: (line, className) => (className + line)
        },
        { regex: /^ +(-->) +/,
          compute: (line, className) => (className + line)
        },
        { regex: /^'([^']*)'/,
          compute: (line, className) => ('note "' + line.replace(/^'([^']*)'/, (_, $1) => $1) + '" as N' + UmlComponent.noteId++)
        },
        { regex: /^ +<?'([^']*)'/,
          compute: (line, className) => ('note left of ' + className + ' #f2f2f2: ' + line.replace(/^ +<?'([^']*)'/, (_, $1) => $1))
        },
        { regex: /^ +>'([^']*)'/,
          compute: (line, className) => ('note right of ' + className + ' #f2f2f2: ' + line.replace(/^ +>'([^']*)'/, (_, $1) => $1))
        },
        { regex: /^ +\^'([^']*)'/,
          compute: (line, className) => ('note top of ' + className + ' #f2f2f2: ' + line.replace(/^ +\^'([^']*)'/, (_, $1) => $1))
        },
        { regex: /^ +(-->) +/,
          compute: (line, className) => (className + line)
        },
        { regex: /^ +(--\|>) +([a-zA-Z]+)/,
          compute: (line, className) => line.replace(/^ +(--\|>) +([a-zA-Z]+)/, (_, $1, $2) => ($2 + ' <|-- ' + className))
        }
      ].some(rule => {
        if(rule.regex.test(line)) {
          plantCode += rule.compute(line, $currentClass) + '\n';
          return true;
        }
        return false;
      });

    });

    return plantCode;
  }

  /*
   @umlseq
   rcsCacheManager.refreshIndex()
   rcsIndexer.addToIndex()
   rcsIndexer.buildHierarchy()
   'create children list'
   Utile.format()
   rcsIndexer.saveHierarchy()
   @umlseq

   @startuml
   hide footbox

   [-> rcsCacheManager : refreshIndex()
   rcsCacheManager -> rcsIndexer : addToIndex()
   rcsIndexer -> rcsIndexer : buildHierarchy()
   activate rcsIndexer
   note right of rcsIndexer : create children list\ncreate parents list
   rcsIndexer -> Utile : format()
   deactivate rcsIndexer
   rcsIndexer -> rcsIndexer : saveHierarchy()
   @enduml
   */
  private diagramSequence(code) {
    let plantCodeHeader = `
skinparam handwritten true
hide footbox
`;
    let acc = {
      preTabs:[],
      preClass:[],
      preGroup:[],
      lines:[plantCodeHeader]
    };

    // last Array's elem
    function lastElem(elems: string[], defaultElem: string) {
      return elems.length>0 ? elems[elems.length-1] : defaultElem;
    }

    code.split('\n').forEach((curLine) => {

      // check if condition [xxx] before function exist
      let [,$condTabs='', $condDirection='', $condCondition='', $condFunction=''] = curLine.match(/^( *)([<>])?\[([^\]]*)\](.*)/) || [];
      if($condCondition) {
        // remove condition, will add it after computing function
        curLine = $condTabs + $condFunction
      }
      // compute function
      let [,$tabs='', $class='', $fct='', $param=''] = curLine.match(/^( *)([a-zA-Z.]+)\.([a-zA-Z]+)\(([^)]*)\)/) || [];
      if($class && $fct)
      {
        // pop until same tabs level
        let lastPreTabs = lastElem(acc.preTabs, '');
        while(lastPreTabs.length >= $tabs.length && acc.preTabs.length != 0) {
          let preClass = acc.preClass.pop();
          acc.preTabs.pop();
          let deactivate = acc.preGroup.pop();
          if(deactivate) {
            acc.lines.push('deactivate ' + preClass);
          }

          lastPreTabs = lastElem(acc.preTabs, '');
        }

        // create new
        if($fct=='new') {
          acc.lines.push('create ' + $class);
        }

        // get last class and push new line
        let lastPreClass = lastElem(acc.preClass, '[');
        let plantLine = lastPreClass + '->' + $class + ':' + $fct + '(' + $param + ')';
        acc.lines.push(plantLine);

        if($condCondition) {
          $condDirection == '>'
            ? acc.lines.push('hnote right #fff0e6: ' + $condCondition)
            : acc.lines.push('hnote left #fff0e6: ' + $condCondition);
        }

        // manage group
        if(lastPreClass == $class) {
          acc.lines.push('activate ' + $class);
          acc.preGroup.push(true);
        }
        else {
          acc.preGroup.push(false);
        }

        // push new level
        acc.preClass.push($class);
        acc.preTabs.push($tabs);
      }
      else {
        // compute note
        let [,$tabs='', $note=''] = curLine.match(/^( *)'([^']*)'/) || [];
        if($note) {
          // get class name from same tabs level
          let tabPos = acc.preTabs.length;
          while(tabPos > 0 && acc.preTabs[tabPos-1].length >= $tabs.length) {
            tabPos--;
          }

          if(tabPos > 0) {
            acc.lines.push('rnote right of ' + acc.preClass[tabPos-1] + ' #f2f2f2: ' + $note);
          }
          else if (acc.preClass.length>0) {
            acc.lines.push('rnote left of ' + acc.preClass[tabPos] + ' #f2f2f2: ' + $note);
          }
        }
        else {
          if(/\.\.\./.test(curLine)) {
            acc.lines.push(curLine);
          }
          // group begin (https://regex101.com/r/WxcAhE/1)
          else if (/^ *#+([^#\n\r]+)#*/.test(curLine)) {
            acc.lines.push(curLine.replace(/^ *#+([^#\n\r]+)#*/, (_, $1) => ('group ' + $1)));
          }
          // group end
          else if (/^ *#+$/.test(curLine)) {
            acc.lines.push('end');
          }
        }
      }

      //console.log("acc=" , {preTabs:[...acc.preTabs], preClass:[...acc.preClass], lines:[...acc.lines]});
      return acc;
    });

    return acc.lines.join('\n');
  }

}
