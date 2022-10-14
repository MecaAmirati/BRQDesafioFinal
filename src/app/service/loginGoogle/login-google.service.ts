import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginGoogleService {
  constructor() { }

  // handleCredentialResponse(response) {
  //   console.log("Encoded JWT ID token: " + response.credential);
  // }
  // window.onload = function () {
  //   google.accounts.id.initialize({
  //     client_id: "  474504906176-5o7fpn1d2tb5ird8drekpdn10c8d7e7e.apps.googleusercontent.com",
  //     callback: handleCredentialResponse
  //   });
  //   google.accounts.id.renderButton(
  //     document.getElementById("buttonDiv"),
  //     { theme: "outline", size: "large" }  // customization attributes
  //   );
  //   google.accounts.id.prompt(); // also display the One Tap dialog
  // }

}
