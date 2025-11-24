import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {AuthResult, ExtstatsApi} from "extstats-api";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {CookieService} from "extstats-angular";

type LoginState = "START" | "LOGIN_BUTTON" | "LOGOUT_BUTTON" | "LOGIN_FORM" | "SIGNUP_FORM" |
  "PASSWORD_FORM" | "NOT_CONFIRMED" | "NEED_TO_SIGN_UP" | "SHOW_SIGNUP_CODE" | "ALREADY_SIGNED_UP" |
  "WRONG_PASSWORD" | "LOGOUT_FORM";

@Component({
  selector: 'extstats-login',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ]
})
export class LoginComponent implements AfterViewInit {
  readonly COOKIE_NAME = "extstatsid";
  state: LoginState = "START";
  @ViewChild('password') password: ElementRef | undefined;
  @ViewChild('username') username: ElementRef | undefined;
  usernameError = false;
  passwordError = false;
  code: string | undefined = undefined;
  error: string | undefined = undefined;
  disabled = false;

  constructor(private eRef: ElementRef, private api: ExtstatsApi, private cookieService: CookieService) {
  }

  showLogoutForm() {
    this.state = "LOGOUT_FORM";
  }

  logout() {
    this.api.logout().then(() => {
      this.close();
      window.postMessage("logout");
    });
  }

  private clearErrors() {
    this.usernameError = false;
    this.passwordError = false;
  }

  close() {
     this.state = "START";
     this.disabled = false;
     this.clearErrors();
     this.checkForLoggedIn();
  }

  goToLogin() {
    this.state = "LOGIN_FORM";
    this.disabled = false;
    this.clearErrors();
  }

  async changePassword(): Promise<void> {
    this.state = "PASSWORD_FORM";
  }

  async doChangePassword(): Promise<void> {
    if (this.username && this.password) {
      this.usernameError = !this.username.nativeElement.value;
      this.passwordError = !this.password.nativeElement.value;
      if (!this.usernameError && !this.passwordError) {
        this.disabled = true;
        const result: AuthResult = await this.api.changedPassword(this.username.nativeElement.value, this.password.nativeElement.value);
        if (result.type === "code") {
          this.code = result.code;
          this.state = "SHOW_SIGNUP_CODE";
        } else if (result.type === "failure") {
          this.code = undefined;
          this.state = result.state as LoginState;
        }
        this.disabled = false;
      }
    }
    return undefined;
  }

  async login(): Promise<any> {
    if (this.username && this.password) {
      this.usernameError = !this.username.nativeElement.value;
      this.passwordError = !this.password.nativeElement.value;
      if (!this.usernameError && !this.passwordError) {
        this.disabled = true;
        const result: AuthResult = await this.api.login(this.username.nativeElement.value, this.password.nativeElement.value);
        if (result.type === "userdata") {
          this.disabled = false;
          // TODO - tell the page about the user's data
          this.close();
          window.postMessage("login");
          return result.data;
        } else if (result.type === "failure") {
          this.state = result.state as LoginState;
        }
        this.disabled = false;
      }
    }
    return undefined;
  }

  async signup() {
    if (this.username && this.password) {
      this.usernameError = !this.username.nativeElement.value;
      this.passwordError = !this.password.nativeElement.value;
      if (!this.usernameError && !this.passwordError) {
        this.disabled = true;
        const result: AuthResult = await this.api.signup(this.username.nativeElement.value, this.password.nativeElement.value);
        if (result.type === "code") {
          this.code = result.code;
          this.state = "SHOW_SIGNUP_CODE";
        } else if (result.type === "failure") {
          this.code = undefined;
          this.state = result.state as LoginState;
        }
        this.disabled = false;
        if (this.state === "START") this.checkForLoggedIn();
      }
    }
  }

  expand() {
    this.state = "LOGIN_FORM";
  }

  showSignup() {
    this.state = "SIGNUP_FORM";
  }

  public ngAfterViewInit() {
    this.checkForLoggedIn();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.state === "LOGIN_FORM") {
        this.close();
      } else if (this.state === "SIGNUP_FORM") {
        this.clearErrors();
        this.state = "LOGIN_FORM";
      }
    }
  }

  private checkForLoggedIn() {
    console.log("checkForLoggedIn");
    const cookie = this.cookieService.getCookie(this.COOKIE_NAME);
    console.log(`cookie = ${cookie}`);
    this.state = (!!cookie) ? "LOGOUT_BUTTON" : "LOGIN_BUTTON";
  }
}
