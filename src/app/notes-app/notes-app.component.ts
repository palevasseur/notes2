import {Component, OnInit, ViewChild} from '@angular/core';
import { NoteService } from '../note.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';

// import 'rxjs/add/operator/throttle';

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
  keywordsFilter: string[][] = []; // search input, ex: js, obj test => [['js'], ['obj', 'test']] => js OR (obj AND test)
  suggestControl = new FormControl();
  suggestOptions: Observable<Suggestion[]>;

  constructor(private route: ActivatedRoute, private noteService: NoteService) {
  }

  ngOnInit() {
    // search keywords param
    // todo: when search keywords changed => need to reflect in url
    const paramSearch = this.route.snapshot.queryParamMap.get('search');
    this.keywordsFilter = this.computeKeywords(paramSearch);
    this.suggestControl.setValue(paramSearch);

    // category param
    const paramCategory = (this.route.snapshot.queryParamMap.get('category') || '').toLowerCase();
    this.categories = this.noteService.getCategories();
    const foundCategory = this.categories.filter(c => c.value == paramCategory);
    this.selectedCategory = foundCategory.length ? foundCategory[0].value : this.categories[0].value;
    this.categoryChanged();

    this.suggestOptions = this.suggestControl.valueChanges.map(val => this.suggest(val));
  }

  get selectedCategoryName() {
    return this.categories.filter(cat => cat.value == this.selectedCategory)[0].name;
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

    const match = /(.*[, ])?(.*)/g.exec(val);
    const beforeKeyword = match[1] || '';
    const lastKeyword = match[2] || '';

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
    const keywordsFilter = [];
    if (keywordsInput) {
      keywordsInput
        .toLowerCase()
        .split(',')
        .forEach(
          keywords => {
            const kw = keywords.split(' ').filter(k => !!k);
            if (kw.length > 0) {
              keywordsFilter.push(kw);
            }
          }
        );
    }

    return keywordsFilter;
  }

}
