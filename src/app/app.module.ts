import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MdCardModule, MdButtonModule, MdButtonToggleModule, MdInputModule, MdToolbarModule,
  MdIconModule, MdMenuModule, MdAutocompleteModule, MdSelectModule
} from '@angular/material';
import {AngularFireModule, AuthProviders, AuthMethods} from 'angularfire2';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { NotesAppComponent } from './notes-app/notes-app.component';
import { FilterNotesPipe } from './notes-app/filter-notes.pipe';
import { FormatTextPipe } from './notes-app/format-text.pipe';
import { NoteComponent } from './note/note.component';
import {NoteService} from './note.service';

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
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpModule,
    MdCardModule, MdToolbarModule, MdButtonModule, MdButtonToggleModule, MdInputModule, MdIconModule,
    MdMenuModule, MdAutocompleteModule, MdSelectModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  declarations: [ AppComponent, NotesAppComponent, FilterNotesPipe, FormatTextPipe, NoteComponent ],
  providers: [NoteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
