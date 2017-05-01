import {Component, OnInit, ViewChild} from '@angular/core';
import { NoteService } from '../note.service';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
//import 'rxjs/add/operator/throttle';

interface Suggestion {expression: string, display: string}

@Component({
  selector: 'app-notes-app',
  templateUrl: './notes-app.component.html',
  styleUrls: ['./notes-app.component.css']
})
export class NotesAppComponent implements OnInit {

  @ViewChild('idCreateNote') createNote;

  categories: {name: string, value: string}[];
  selectedCategory: string; // value of the category
  showNoteInfo = false;

  // keywords search
  keywordsFilter: string[][] = []; // ex: js, obj test => [['js'], ['obj', 'test']] => js OR (obj AND test)
  suggestControl = new FormControl();
  suggestOptions: Observable<Suggestion[]>;

  constructor(private noteService: NoteService) {
  }

  ngOnInit() {
    this.categories = this.noteService.getCategories();
    if (this.categories.length > 0) {
      this.selectedCategory = this.categories[0].value;
    }

    this.categoryChanged();

    this.suggestOptions = this.suggestControl.valueChanges.map(val => this.suggest(val));
  }

  private static flatten(keywords: string[][]): string[] {
    return [].concat.apply([], keywords);
  }

  static formatDate(date: number) {
    return (new Date(date)).toString();
  }

  categoryChanged() {
    this.noteService.resetKeywordsList();
    this.noteService.setCategory(this.selectedCategory);
  }

  showNewNote() {
    this.createNote.display = true;
  }

  suggest(val: string): Suggestion[] {
    this.keywordsFilter = this.computeKeywords(val);

    let match = /(.*[, ])?(.*)/g.exec(val);
    let beforeKeyword = match[1] || '';
    let lastKeyword = match[2] || '';

    return this.suggestions
      .filter(elem => {
        return elem.indexOf(lastKeyword) >= 0;
      })
      .map(elem => {
        return {
          expression: beforeKeyword + elem,
          display: elem
        };
      });
  }

  get notes() {
    return this.noteService.getAllNotes();
  }

  get suggestions() {
    return this.noteService.getKeywordsList();
  }

  private computeKeywords(keywordsInput: string): string[][] {
    let keywordsFilter = [];
    if (keywordsInput) {
      keywordsInput
        .toLowerCase()
        .split(',')
        .forEach(
          keywords => {
            let kw = keywords.split(' ').filter(kw => !!kw);
            if(kw.length > 0) {
              keywordsFilter.push(kw);
            }
          }
        );
    }

    return keywordsFilter;
  }

}
