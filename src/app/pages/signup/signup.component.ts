import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  password = '';
  username = '';
  errorMsg = '';
  image?: File;
  mail = '';
  src: string = '../../../assets/SignUpImage.jpg';
  constructor(private authS: AuthService, private sanitization: DomSanitizer) {}

  ngOnInit(): void {}

  signUp() {
    console.log(this.mail + ' - ' + this.username);
    this.authS.postUser(this.mail, this.password, this.username, this.image);
  }

  onFileSelected($event: any) {
    if ($event.target.files.length > 0) {
      this.image = $event.target.files[0];
      const src = this.sanitization.bypassSecurityTrustResourceUrl(
        URL.createObjectURL($event.target.files[0])
      ) as string;
      this.src = src;
    }
  }
}
