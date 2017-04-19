import {Component, OnInit, ViewChild, Inject, ElementRef} from '@angular/core';
import { Note } from '../note';
import { NoteService } from '../note.service';

declare var jQuery:any;

@Component({
  selector: 'app-notes-app',
  templateUrl: './notes-app.component.html',
  styleUrls: ['./notes-app.component.css']
})
export class NotesAppComponent implements OnInit {

  @ViewChild('idCreateNote') createNote;
  @ViewChild('idKeywordsSearch') keywordsSearch;

  categories: {name: string, value: string}[];
  selectedCategory: string; // value of the category
  displayCategories: boolean = true; // display categories true => init with the good category
  showNoteInfo: boolean = false;

  // keywords search
  keywordsInput: string = ''; // ex: js, obj test
  keywordsFilter: string[][] = []; // ex: js, obj test => [['js'], ['obj', 'test']] => js OR (obj AND test)

  constructor(private noteService: NoteService) {
  }

  /*
   elementRef: ElementRef;

   constructor(@Inject(ElementRef) elementRef: ElementRef, private noteService: NoteService) {
   this.elementRef = elementRef;
   }
   */

  ngOnInit() {
    this.categories = this.noteService.getCategories();
    if(this.categories.length>0) {
      this.selectedCategory = this.categories[0].value;
    }

    //this.noteService.setCategory(this.currentCategoryValue);
  }

  ngAfterViewInit() {
    var _this = this;
    //jQuery(this.elementRef.nativeElement)
    //  .find('#idKeywordsSearch')
    jQuery(this.keywordsSearch.nativeElement).autocomplete({
        source:function( request, response ) {
          // suggest against the last term of input
          response( jQuery.ui.autocomplete.filter(
            _this.suggestions, request.term.split(/[ ,]/).pop() ) );
        },
        focus: function() {
          return false; // prevent value inserted on focus
        },
        select: (e, args) => {
          let previousEntry = _this.keywordsInput.replace(/(.*[, ]).*|.*/, '$1');
          _this.keywordsInput = previousEntry + args.item.value; // https://regex101.com/r/YSDuUD/1
          return false; // prevent value set on exact match
        }
      });
  }

  private static flatten(keywords: string[][]): string[] {
    return [].concat.apply([], keywords);
  }

  formatDate(date: number) {
    return (new Date(date)).toString();
  }

  get selectedCategoryName() {
    let cat = this.categories.filter(cat => cat.value==this.selectedCategory);
    return cat.length>0 ? cat[0].name : '';
  }

  static previousCategory = ''; // todo: remove this workaround
  categoryChanged() {
    if(NotesAppComponent.previousCategory==this.selectedCategory) {
      return;
    }

    this.displayCategories = false;
    this.noteService.resetKeywordsList();
    this.noteService.setCategory(this.selectedCategory);
    NotesAppComponent.previousCategory = this.selectedCategory;
  }

  showNewNote() {
    this.createNote.display = true;
  }
/*
  addNote() {
    if (this.keywordsNewNote) {
      this.newNote.keywords = NotesAppComponent.flatten(this.computeKeywords(this.keywordsNewNote));
    }

    this.noteService.addNote(this.newNote);
    this.displayNewNote = false;

    if(this.editingNote) {
      this.removeNote(this.editingNote);
      this.editingNote = null;
    }
  }

  editNote(note) {
    this.editingNote = note;
    this.newNote = new Note();
    this.newNote.title = note.title;
    this.newNote.text = note.text;
    this.keywordsNewNote = note.keywords ? note.keywords.join(',') : '';
    this.displayNewNote = true;
  }

  removeNote(note) {
    this.noteService.deleteNoteById(note.$key);
  }
*/
  search() {
    this.keywordsFilter = this.computeKeywords(this.keywordsInput);
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
