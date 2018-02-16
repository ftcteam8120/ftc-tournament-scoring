import { createMuiTheme } from 'material-ui/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#666ad1',
      main: '#303f9f',
      dark: '#001970',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});