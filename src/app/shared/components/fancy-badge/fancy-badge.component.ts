import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fancy-badge',
  templateUrl: './fancy-badge.component.html',
  styleUrls: ['./fancy-badge.component.scss'],
})
export class FancyBadgeComponent implements OnInit {

  @Input() content = 'None';
  @Input() bgColor = 'primary';
  @Input() size = '';

  text = "";
  badgecolor = "";
  constructor() { }

  ngOnInit() {
    this.text = this.content.substr(0, 1);
    this.badgecolor = 'badge-' + this.bgColor;
  }

}
