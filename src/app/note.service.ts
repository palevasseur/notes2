import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {Note} from './note';

@Injectable()
export class NoteService {

  private items: FirebaseListObservable<any[]>;
  private keywordsList: string[] = [];

  constructor(private fireBase: AngularFire) {
    this.fireBase.auth.subscribe(auth => {
      if(!auth) {
        console.log('User logging...');
        this.fireBase.auth.login();
      }
      else {
        console.log('User ' + auth.uid+ ' logged');
      }
    });
  }

  getCategories() {
    return [
      {name: 'Items', value: 'items'},
      {name: 'Code', value: 'code'},
      {name: 'Photo', value: 'photo'},
      {name: 'Perso', value: 'perso'}
    ];
  }

  getKeywordsList() {
    return this.keywordsList;
  }

  resetKeywordsList() {
    this.keywordsList = [];
  }

  updateKeywordsList(newKeys: string[]) {
    if(newKeys) {
      newKeys.forEach(key => {
        if(this.keywordsList.indexOf(key) == -1) {
          this.keywordsList.push(key);
        }
      });
    }
  }

  setCategory(notesCategory) {
    this.items = this.fireBase.database.list('/' + notesCategory);

    this.items.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.updateKeywordsList(snapshot.keywords);
      });
    });
  }

  addNote(note: Note) {
    if (this.items) {
      this.items.push(note);
      this.updateKeywordsList(note.keywords);
    }
  }

  updateNote(key: string, note: Note) {
    if (this.items) {
      this.items.update(key, note);
      this.updateKeywordsList(note.keywords);
    }
  }

  deleteNoteById(key: string) {
    if (this.items && key) {
      this.items.remove(key);
    }
  }

  getAllNotes(): FirebaseListObservable<any[]> {
    return this.items;
  }

}
