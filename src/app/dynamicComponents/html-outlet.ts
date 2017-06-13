// https://stackoverflow.com/questions/40092639/how-to-render-a-dynamic-template-with-components-in-angular2
// https://plnkr.co/edit/27x0eg?p=preview
import {
  Component,
  Directive,
  NgModule,
  Input,
  ViewContainerRef,
  Compiler,
  ComponentFactory,
  ModuleWithComponentFactories,
  ComponentRef,
  ReflectiveInjector
} from '@angular/core';

import { RouterModule }  from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.module';
import { AppModule } from '../app.module';

export function createComponentFactory(compiler: Compiler, metadata: Component): Promise<ComponentFactory<any>> {
  const cmpClass = class DynamicComponent {};
  const decoratedCmp = Component(metadata)(cmpClass);

  @NgModule({
    imports: [AppModule, CommonModule, RouterModule, SharedModule],
    declarations: [decoratedCmp]
  })
  class DynamicHtmlModule { }

  return compiler.compileModuleAndAllComponentsAsync(DynamicHtmlModule)
    .then((moduleWithComponentFactory: ModuleWithComponentFactories<any>) => {
      return moduleWithComponentFactory.componentFactories.find(x => x.componentType === decoratedCmp);
    });
}

@Directive({ selector: 'html-outlet' })
export class HtmlOutlet {
  @Input() html: string;
  cmpRef: ComponentRef<any>;

  constructor(private vcRef: ViewContainerRef, private compiler: Compiler) { }

  ngOnChanges() {
    const html = this.html;
    if (!html) return;

    if(this.cmpRef) {
      this.cmpRef.destroy();
    }

    const compMetadata = new Component({
      selector: 'dynamic-html',
      template: this.html,
    });

    createComponentFactory(this.compiler, compMetadata)
      .then(factory => {
        const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
        this.cmpRef = this.vcRef.createComponent(factory, 0, injector, []);
      });
  }

  ngOnDestroy() {
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}
