// websocket.service.ts
import { Injectable } from '@angular/core'
import { Subject, interval } from 'rxjs'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { retry, tap } from 'rxjs/operators'
import {CookieService} from "extstats-angular";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any> | undefined;
  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$.asObservable();

  constructor(private cookieService: CookieService) {
  }

  getChatterId(): string | undefined {
    const s = this.cookieService.getCookie("extstatschatter");
    if (!s || !s.trim()) return undefined;
    return s;
  }

  connect(url: string): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url: url,
        openObserver: {
          next: () => {
            console.log(`WebSocket connected ${new Date()}`);
          }
        },
        closeObserver: {
          next: () => {
            console.log(`WebSocket disconnected ${new Date()}`);
          }
        }
      })

      this.socket$
        .pipe(
          retry({
            count: 1,
            delay: (error, retryCount) => {
              console.log(`Retry attempt ${retryCount}`);
              return interval(3000);
            }
          }),
          tap({
            error: (error) => console.error('WebSocket error:', error)
          })
        ).subscribe({
          next: (message) => this.messagesSubject$.next(message),
          error: (error) => console.error('WebSocket error:', error)
        }
      )
    }
  }

  sendMessage(message: any): void {
    if (this.socket$) {
      this.socket$.next(message)
    }
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete()
    }
  }
}
