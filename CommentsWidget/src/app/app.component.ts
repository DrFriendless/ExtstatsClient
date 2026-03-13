import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {BlogComment, ExtstatsApi} from "extstats-api";
import {UserConfigService} from "extstats-angular";
import {CommentListComponent} from "./comment-list/comment-list.component";
import {CommentEditorComponent} from "./comment-editor/comment-editor.component";
import {NewComment} from "./new-comment";

export interface Comment {
  id: number;
  poster: string;
  content: string;
  me: boolean;
  deleted: boolean;
  when: Date;
  children: Comment[];
}

@Component({
  selector: 'extstats-comments',
  imports: [
    CommentListComponent,
    CommentEditorComponent
  ],
  templateUrl: './app.component.html'
})
export class CommentsWidget implements AfterViewInit {
  url: string = "";
  post_title = "";
  readonly = false;
  loggedIn: boolean;
  comments: Comment[] = [];
  // If the user is making a new commment anywhere, it's this one.
  // if it's undefined, you cannot comment.
  newComment: NewComment | undefined = undefined;

  constructor(elementRef: ElementRef,
              private api: ExtstatsApi, private userService: UserConfigService) {
    this.loggedIn = userService.isLoggedIn();
    // maybe there is another way to do this, but @Input and @Attribute simply don't work.
    this.url = elementRef.nativeElement.attributes.url.value;
    this.post_title = elementRef.nativeElement.attributes.title.value;
    this.readonly = elementRef.nativeElement.attributes.readonly.value === 'true';
    if (this.loggedIn && !this.readonly) this.newComment = new NewComment(this);
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.url) {
      await this.refreshComments();
    }
  }

  private indexComments(cs: BlogComment[]) {
    const currentUser = this.userService.getLoggedInGeek();
    cs.sort((a, b) => a.id - b.id);
    const index: Record<number, Comment> = {};
    const result: Comment[] = [];
    for (const c of cs) {
      const comment: Comment = {
        poster: c.poster, content: c.comment, me: c.poster === currentUser, children: [], deleted: !!c.deleted, when: c.date,
        id: c.id
      };
      index[c.id] = comment;
      if (!c.reply_to) {
        result.push(comment);
      } else if (c.id > c.reply_to && !!index[c.reply_to]) {
        index[c.reply_to].children.push(comment);
      } else {
        result.push(comment);
      }
    }
    this.comments = this.prune(result);
  }

  private prune(comments: Comment[]): Comment[] {
    comments.forEach(c => c.children = this.prune(c.children));
    return comments.filter(c => !c.deleted || c.children.length > 0);
  }

  private async refreshComments() {
    const cs = await this.api.retrieveCommentsForUrl(this.url!);
    this.indexComments(cs);
  }

  async delete(id: number): Promise<void> {
    if (!id) return;
    const blah = await this.api.deleteComment(id);
    if (this.newComment) this.newComment.reset();
    this.indexComments(blah.posts);
  }

  async save(id: number | undefined, replyTo: number | undefined): Promise<void> {
    if (!this.url || !this.newComment) return;
    this.newComment.content = this.newComment.content.trim();
    if (this.newComment.content.trim().length === 0) {
      return;
    }
    if (id === undefined) {
      const blah = await this.api.saveComment(this.url, this.newComment.content, replyTo, this.post_title);
      this.newComment.reset();
      this.indexComments(blah.posts);
    } else {
      const blah = await this.api.updateComment(id, this.newComment.content);
      this.newComment.reset();
      this.indexComments(blah.posts);
    }
  }
}
