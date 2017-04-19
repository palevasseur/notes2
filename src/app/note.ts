export class Note {
  title: string = '';
  text: string = '';
  keywords: string[];
  date: number; // date in ms (to easily save in database)
  sortId: number;

  constructor(values: Object = {}) {
    this.date = (new Date()).getTime();
    (<any>Object).assign(this, values);
  }
}
