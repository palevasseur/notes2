import {Component, NgModule} from '@angular/core'
import {TextComponent} from './text.component'
import {FormsModule} from '@angular/forms'; // need by UmlComponent using textarea
import {UmlComponent} from './uml.component'

// define all component defs to be dynamically created here
// need to be define in a share module to avoid to be define several time in html-outlet.createComponentFactory()

@NgModule({
  imports: [FormsModule],
  declarations: [TextComponent, UmlComponent],
  exports: [TextComponent, UmlComponent]
})
export class SharedModule {
}
