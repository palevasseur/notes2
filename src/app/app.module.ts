import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import {AngularFireModule, AuthProviders, AuthMethods} from 'angularfire2';

import { AppComponent } from './app.component';
import { NotesAppComponent } from './notes-app/notes-app.component';
import { FilterNotesPipe } from './notes-app/filter-notes.pipe';
import { FormatTextPipe } from './notes-app/format-text.pipe';
import { NoteComponent } from './note/note.component';
import {NoteService} from "./note.service";

export const firebaseConfig = {
  apiKey: 'AIzaSyCnaOC0gmAab9iEGN9I1UyIR3G8zwCvkWk',
  authDomain: 'notes-6f837.firebaseapp.com',
  databaseURL: 'https://notes-6f837.firebaseio.com',
  storageBucket: 'notes-6f837.appspot.com',
  messagingSenderId: '294714633105'
};

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};

@NgModule({
  imports: [ BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  declarations: [ AppComponent, NotesAppComponent, FilterNotesPipe, FormatTextPipe, NoteComponent ],
  providers: [NoteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
