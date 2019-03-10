import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  hero: Hero;
  heroes = HEROES;
  selectedHero: Hero;

  constructor() { }

  ngOnInit() {
    this.hero = { id: 1, name: "Barton" };
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

}
