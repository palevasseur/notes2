import { Notes2Page } from './app.po';

describe('notes2 App', () => {
  let page: Notes2Page;

  beforeEach(() => {
    page = new Notes2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
