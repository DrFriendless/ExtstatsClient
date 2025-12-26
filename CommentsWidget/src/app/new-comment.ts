import {Comment, CommentsWidget} from "./app.component";

export class NewComment {
  content: string = "";
  cancelled: boolean = true;
  replyTo: number | undefined;
  comment: Comment | undefined;

  constructor(private owner: CommentsWidget) {
  }

  doNewPost(): void {
    this.replyTo = undefined;
    this.cancelled = false;
  }

  doReplyTo(id: number): void {
    this.replyTo = id;
    this.cancelled = false;
  }

  doEdit(comment: Comment): void {
    this.replyTo = undefined;
    this.cancelled = false;
    this.comment = comment;
  }

  cancel(text: string): void {
    this.content = text;
    this.cancelled = true;
  }

  async delete(id: number): Promise<void> {
    await this.owner.delete(id);
  }

  isTopLevel(): boolean {
    return !this.replyTo && !this.cancelled && !this.comment;
  }

  isEditing(id: number): boolean {
    return !this.replyTo && !this.cancelled && !!this.comment && (this.comment.id === id);
  }

  isInReplyTo(id: number): boolean {
    return this.replyTo === id && !this.cancelled;
  }

  async save() {
    await this.owner.save(this.comment?.id, this.replyTo);
  }

  reset(): void {
    this.replyTo = undefined;
    this.content = "";
    this.comment = undefined;
    this.cancelled = true;
  }
}
