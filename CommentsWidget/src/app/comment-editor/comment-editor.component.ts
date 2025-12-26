
import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {NewComment} from "../new-comment";
import {Comment} from "../app.component";
import {DatePipe, NgClass} from "@angular/common";

@Component({
  selector: 'comment-editor',
  imports: [
    NgClass,
    DatePipe
  ],
  templateUrl: './comment-editor.component.html'
})
export class CommentEditorComponent implements OnInit {
  @Input() comment: Comment | undefined;
  @Input({ required: true }) newComment!: NewComment | undefined;
  @Input({ required: true }) saveText!: string;
  @ViewChild('ta') ta: ElementRef<HTMLTextAreaElement> | undefined;
  editing: boolean = false;
  text: string = "";

  ngOnInit(): void {
    this.editing = !!this.newComment && (!this.comment || (!!this.newComment.comment && (this.comment.id === this.newComment.comment.id)));
    this.text = (this.editing && this.newComment) ? this.newComment.content : this.comment!.content
  }

  async save(text: string, button: HTMLButtonElement): Promise<void> {
    if (!text || !this.newComment) return;
    console.log(button);
    this.newComment.content = text;
    button.disabled = true;
    await this.newComment.save();
    button.disabled = false;
    this.editing = false;
  }

  edit() {
    if (this.newComment && this.comment) {
      this.newComment.doEdit(this.comment);
      this.editing = true;
    }
    if (this.ta) {
      this.ta.nativeElement.focus();
      this.ta.nativeElement.selectionStart = this.ta?.nativeElement.textLength;
    }
  }

  async delete() {
    await this.newComment!.delete(this.comment!.id);
  }

  cancel(text: string) {
    if (this.newComment) this.newComment.cancel(text);
    this.editing = false;
  }

  protected readonly JSON = JSON;
}
