import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-listing-page',
  templateUrl: './listing-page.component.html',
  styleUrls: ['./listing-page.component.scss']
})
export class ListingPageComponent {
  user = {} 

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {

  }
}
