import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {AuthResult, ExtstatsApi} from "extstats-api";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {CookieService, UserDataService} from "extstats-angular";

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
  accounts: string[] = [];
  geek: string | undefined;

  constructor(private eRef: ElementRef, private api: ExtstatsApi, private cookieService: CookieService,
              private userService: UserDataService) {
  }

  showLogoutForm() {
    this.state = "LOGOUT_FORM";
  }

  logout() {
    this.api.logout().then(async () => {
      await this.close();
      window.postMessage("logout");
    });
  }

  private clearErrors() {
    this.usernameError = false;
    this.passwordError = false;
  }

  async close() {
    this.state = "START";
    this.disabled = false;
    this.clearErrors();
    await this.checkForLoggedIn();
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

  async login(): Promise<void> {
    if (this.username && this.password) {
      this.usernameError = !this.username.nativeElement.value;
      this.passwordError = !this.password.nativeElement.value;
      if (!this.usernameError && !this.passwordError) {
        this.disabled = true;
        const result: AuthResult = await this.api.login(this.username.nativeElement.value, this.password.nativeElement.value);
        if (result.type === "userdata") {
          this.disabled = false;
          await this.close();
          await this.userService.setAndSave("user.username", this.cookieService.getCookie("extstatsid"));
          window.postMessage("login");
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
        if (this.state === "START") await this.checkForLoggedIn();
      }
    }
  }

  expand() {
    this.state = "LOGIN_FORM";
  }

  showSignup() {
    this.state = "SIGNUP_FORM";
  }

  async ngAfterViewInit() {
    await this.checkForLoggedIn();
  }

  @HostListener('document:click', ['$event'])
  async clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      await this.close();
    }
  }

  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.state === "LOGIN_FORM") {
        await this.close();
      } else if (this.state === "SIGNUP_FORM") {
        this.clearErrors();
        this.state = "LOGIN_FORM";
      }
    }
  }

  getGeek(): string | undefined {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i=0; i<vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] === "geek") return pair[1];
    }
    return undefined;
  }

  setGeek(geek: string): void {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    const newVars = [ `geek=${geek}` ];
    for (const v of vars) {
      if (!v.trim()) continue;
      const pair = v.split("=");
      if (pair[0] && pair[0] !== "geek") newVars.push(v);
    }
    if (newVars.length) {
      window.location.search = '?' + newVars.join("&");
    } else {
      window.location.search = "";
    }
  }

  private async checkForLoggedIn() {
    const cookie = this.cookieService.getCookie(this.COOKIE_NAME);
    this.state = (!!cookie) ? "LOGOUT_BUTTON" : "LOGIN_BUTTON";
    if (cookie) {
      const usernames: string[] = await this.userService.get("user.usernames", []);
      if (usernames.length === 0) usernames.push(cookie);
      this.accounts = usernames;
      let g = this.getGeek();
      if (!g) g = cookie;
      this.geek = g;
    }
  }
}
