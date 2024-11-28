import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit, OnDestroy {
  editor: Editor;
  html = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  @Input() placeholderText : string;

  @Input() actualValue : string = '';

  @Output()
  htmlEmitter: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.editor = new Editor();

    if(this.actualValue) {
      this.html = this.actualValue;
      this.editor.setContent(this.html);
    }
  }

  onHtmlChange(value: string): void {
    this.html = value;
    this.htmlEmitter.emit(this.html);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
