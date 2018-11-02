import {Injectable} from '@angular/core';
import {} from 'angularfire2';
import {Note} from './note';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class NoteService {

  private items: FirebaseListObservable<any[]>;
  private keywordsList: string[] = [];

  constructor(private fireBaseDB: AngularFireDatabase, fireBaseAuth: AngularFireAuth) {
    fireBaseAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('User logging...');
        fireBaseAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
      } else {
        console.log('User ' + auth.uid + ' logged');
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
    if (newKeys) {
      newKeys.forEach(key => {
        if (this.keywordsList.indexOf(key) == -1) {
          this.keywordsList.push(key);
        }
      });
    }
  }

  setCategory(notesCategory) {
    this.items = this.fireBaseDB.list('/' + notesCategory);

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
