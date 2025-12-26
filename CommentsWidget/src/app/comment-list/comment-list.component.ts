import {Component, Input} from "@angular/core";
import {Comment} from "../app.component";
import {CommentEditorComponent} from "../comment-editor/comment-editor.component";
import {NewComment} from "../new-comment";

@Component({
  selector: 'comment-list',
  imports: [
    CommentEditorComponent
  ],
  templateUrl: './comment-list.component.html'
})
export class CommentListComponent {
  @Input('comments') comments: Comment[] = [];
  @Input({ required: true }) newComment!: NewComment | undefined;
  @Input('indent') indent = 0;

  replyTo(id: number) {
    if (this.newComment) this.newComment.doReplyTo(id);
  }
}
