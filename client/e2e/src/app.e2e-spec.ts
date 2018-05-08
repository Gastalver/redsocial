import { AppPage } from './app.po';

describe('RedSocial', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Debe crear una barra de navegación con Inicio - Timeline y Usuarios', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
