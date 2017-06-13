import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MdCardModule, MdButtonModule, MdButtonToggleModule, MdInputModule, MdToolbarModule,
  MdIconModule, MdMenuModule, MdAutocompleteModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { NotesAppComponent } from './notes-app/notes-app.component';
import { FilterNotesPipe } from './notes-app/filter-notes.pipe';
import { FormatTextPipe } from './notes-app/format-text.pipe';
import { NoteComponent } from './note/note.component';
import {NoteService} from './note.service';
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";
import {HtmlOutlet} from "./dynamicComponents/html-outlet";

export const firebaseConfig = {
  apiKey: 'AIzaSyCnaOC0gmAab9iEGN9I1UyIR3G8zwCvkWk',
  authDomain: 'notes-6f837.firebaseapp.com',
  databaseURL: 'https://notes-6f837.firebaseio.com',
  storageBucket: 'notes-6f837.appspot.com',
  messagingSenderId: '294714633105'
};

@NgModule({
  imports: [ BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpModule,
    MdCardModule, MdToolbarModule, MdButtonModule, MdInputModule, MdIconModule,
    MdMenuModule, MdAutocompleteModule,
    AngularFireModule.initializeApp(firebaseConfig, 'app-root'),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  declarations: [ AppComponent, NotesAppComponent, FilterNotesPipe, FormatTextPipe, NoteComponent, HtmlOutlet],
  providers: [NoteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
