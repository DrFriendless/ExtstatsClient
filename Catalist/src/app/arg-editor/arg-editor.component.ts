import {AfterViewInit, Component, Input} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {ARG_TYPE, ParamType} from "../selector-types.mjs";
import {CatalistComposerComponent} from "../composer/composer.component";

@Component({
  selector: 'arg-editor',
  imports: [
    FormsModule,
  ],
  templateUrl: './arg-editor.component.html'
})
export class ArgEditorComponent implements AfterViewInit {
  @Input('argType') argType!: ARG_TYPE;
  text: string = "";

  constructor(private composer: CatalistComposerComponent) {
  }

  getValue(): ParamType | undefined {
    return undefined;
  }

  calcText() {

  }

  ngAfterViewInit(): void {
    this.calcText();
  }

  hasValue(): boolean {
    return !!this.text;
  }
}
