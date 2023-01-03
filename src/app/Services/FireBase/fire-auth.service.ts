import {Injectable, OnDestroy} from '@angular/core';
import {FirebaseAuthentication} from '@capacitor-firebase/authentication';
import {Router} from '@angular/router';
import {Auth, signInWithCredential, signOut} from '@angular/fire/auth';
import {updateProfile, GoogleAuthProvider, GithubAuthProvider, User} from 'firebase/auth';
import {Capacitor} from '@capacitor/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService implements OnDestroy {
  public currentUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(undefined);


  constructor(private auth: Auth, private router: Router) {
    this.auth.onAuthStateChanged(user => this.setCurrentUser(user));
  }

  ngOnDestroy(): void {
    this.currentUser.unsubscribe();
  }

  public isLoggedIn(): boolean {
    return this.currentUser.value !== null && this.currentUser.value !== undefined;
  }

  public getProfilePic(): string {
    const placeholder = '/assets/Portrait_Placeholder.png';
    if (!this.isLoggedIn()) {
      return placeholder;
    }
    return this.currentUser.value.photoURL ? this.currentUser.value.photoURL : placeholder;
  }

  public getDisplayName(): string | undefined {
    return this.isLoggedIn() ? this.currentUser.value.displayName : undefined;
  }

  public getEmail(): string | undefined {
    return this.isLoggedIn() ? this.currentUser.value.email : undefined;
  }

  public getUserUID(): string {
    return this.isLoggedIn() ? this.currentUser.value.uid : '';
  }

  public async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();

    if (Capacitor.isNativePlatform()) {
      await signOut(this.auth);
    }
  }

  public async signInWithGoogle(): Promise<void> {
    const {credential: {idToken}} = await FirebaseAuthentication.signInWithGoogle();

    if (Capacitor.isNativePlatform()) {
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(this.auth, credential);
    }
  }


  public async signInWithGithub(): Promise<void> {

    const {credential: {accessToken}} = await FirebaseAuthentication.signInWithGithub();

    if (Capacitor.isNativePlatform()) {
      const credential = GithubAuthProvider.credential(accessToken);
      await signInWithCredential(this.auth, credential);
    }
  }

  public async updateDisplayName(displayName: string): Promise<void> {
    await updateProfile(this.auth.currentUser, {
      displayName
    });
  }

  private async setCurrentUser(user: User): Promise<void> {
    this.currentUser.next(user);
    if (this.currentUser.value) {
      await this.router.navigate(['/tabs']);
    } else {
      await this.router.navigate(['/login']);
    }
  }

}
