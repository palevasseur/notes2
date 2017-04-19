/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NoteService } from './note.service';
import { Note } from './note';

describe('Service: Note', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteService]
    });
  });

  it('should ...', inject([NoteService], (service: NoteService) => {
    expect(service).toBeTruthy();
  }));

  describe('#getAllNotes()', () => {

    it('should return an empty array by default', inject([NoteService], (service: NoteService) => {
      expect(service.getAllNotes()).toEqual([]);
    }));

    it('should return all notes', inject([NoteService], (service: NoteService) => {
      const note1 = new Note({title: 'Hello 1', complete: false});
      const note2 = new Note({title: 'Hello 2', complete: true});
      service.addNote(note1);
      service.addNote(note2);
      expect(service.getAllNotes()).toEqual([note1, note2]);
    }));

  });

  /*describe('#save(note)', () => {

    it('should automatically assign an incrementing id', inject([NoteService], (service: NoteService) => {
      const tote1 = new Note({title: 'Hello 1', complete: false});
      const tote2 = new Note({title: 'Hello 2', complete: true});
      service.addNote(tote1);
      service.addNote(tote2);
      expect(service.getNoteById(1)).toEqual(tote1);
      expect(service.getNoteById(2)).toEqual(tote2);
    }));

  });*/

 /* describe('#deleteNoteById(id)', () => {

    it('should remove note with the corresponding id', inject([NoteService], (service: NoteService) => {
      const tote1 = new Note({title: 'Hello 1', complete: false});
      const tote2 = new Note({title: 'Hello 2', complete: true});
      service.addNote(tote1);
      service.addNote(tote2);
      expect(service.getAllNotes()).toEqual([tote1, tote2]);
      service.deleteNoteById(1);
      expect(service.getAllNotes()).toEqual([tote2]);
      service.deleteNoteById(2);
      expect(service.getAllNotes()).toEqual([]);
    }));

    it('should not removing anything if note with corresponding id is not found', inject([NoteService], (service: NoteService) => {
      let tote1 = new Note({title: 'Hello 1', complete: false});
      let tote2 = new Note({title: 'Hello 2', complete: true});
      service.addNote(tote1);
      service.addNote(tote2);
      expect(service.getAllNotes()).toEqual([tote1, tote2]);
      service.deleteNoteById(3);
      expect(service.getAllNotes()).toEqual([tote1, tote2]);
    }));

  });*/

  /*describe('#updateNoteById(id, values)', () => {

    it('should return note with the corresponding id and updated data', inject([NoteService], (service: NoteService) => {
      let note = new Note({title: 'Hello 1', complete: false});
      service.addNote(note);
      let updatedNote = service.updateNoteById(1, {
        title: 'new title'
      });
      expect(updatedNote.title).toEqual('new title');
    }));

    it('should return null if note is not found', inject([NoteService], (service: NoteService) => {
      let note = new Note({title: 'Hello 1', complete: false});
      service.addNote(note);
      let updatedNote = service.updateNoteById(2, {
        title: 'new title'
      });
      expect(updatedNote).toEqual(null);
    }));

  });*/

  /*describe('#toggleNoteComplete(note)', () => {

    it('should return the updated note with inverse complete status', inject([NoteService], (service: NoteService) => {
      let note = new Note({title: 'Hello 1', complete: false});
      service.addNote(note);
      let updatedNote = service.toggleNoteComplete(note);
      expect(updatedNote.complete).toEqual(true);
      service.toggleNoteComplete(note);
      expect(updatedNote.complete).toEqual(false);
    }));

  });*/

});
