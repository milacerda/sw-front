import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created with ♥ by <b><a href="https://github.com/milacerda/sw" target="_blank">Camila Lacerda</a></b> 2019</span>
    <div class="socials">
      <a href="https://github.com/milacerda/sw" target="_blank" class="ion ion-social-github"></a>
      `
      // <a href="#" target="_blank" class="ion ion-social-facebook"></a>
      // <a href="#" target="_blank" class="ion ion-social-twitter"></a>
    +`<a href="https://www.linkedin.com/in/camila-lacerda-25969733/" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
