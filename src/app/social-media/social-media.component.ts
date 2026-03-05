import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {
  IonCardTitle,
  IonList,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonLabel,
  IonButton,
  IonCardSubtitle,
  IonAvatar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
  imports: [
    NgOptimizedImage,
    IonAvatar,
    IonCardSubtitle,
    IonButton,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCard,
    IonItem,
    IonList,
    IonCardTitle,
  ],
})
export class SocialMediaComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
