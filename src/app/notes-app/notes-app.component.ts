import {Component, OnInit, ViewChild} from '@angular/core';
import { NoteService } from '../note.service';

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
  keywordsInput = ''; // ex: js, obj test
  keywordsFilter: string[][] = []; // ex: js, obj test => [['js'], ['obj', 'test']] => js OR (obj AND test)

  constructor(private noteService: NoteService) {
  }

  ngOnInit() {
    this.categories = this.noteService.getCategories();
    if (this.categories.length > 0) {
      this.selectedCategory = this.categories[0].value;
    }

    this.categoryChanged();
  }

  ngAfterViewInit() {
  }

  private static flatten(keywords: string[][]): string[] {
    return [].concat.apply([], keywords);
  }

  formatDate(date: number) {
    return (new Date(date)).toString();
  }

  categoryChanged() {
    this.noteService.resetKeywordsList();
    this.noteService.setCategory(this.selectedCategory);
  }

  showNewNote() {
    this.createNote.display = true;
  }

  suggestOptions = [];
  keywordsInputSav = '';
  search() {
    if(this.keywordsInput == this.keywordsInputSav) {
      return;
    }

    this.keywordsInputSav = this.keywordsInput;
    this.keywordsFilter = this.computeKeywords(this.keywordsInput);

    let match = /(.*[, ])?(.*)/g.exec(this.keywordsInput);
    let beforeKeyword = match[1] || '';
    let lastKeyword = match[2] || '';
    this.suggestOptions = this.suggestions
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
          keywords => keywordsFilter.push(
            keywords.split(' ').filter(kw => !!kw)
          )
        );
    }

    return keywordsFilter;
  }

}
