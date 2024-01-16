import { theme as chakraTheme, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    ...chakraTheme.fonts,
    heading: 'Nunito, open-sans',
    body: 'Nunito, open-sans',
  },
  colors: {
    blue: {
      100: '#BAEBFF',
      200: '#68D4F3',
      300: '#0A8DEC',
      status: '#BAEBFF',
      statusText: '#278DEC',
    },
    purple: {
      100: '#F6F7FF',
      200: '#E1E2FF',
      300: '#9BB1FF',
      400: '#718BFC',
      500: '#5431D6',
    },
    grey: {
      100: '#EBEDF1',
      200: '#DEE2E6',
      300: '#ADB5BD',
      400: '#6C757D',
      500: '#495057',
      600: '#343A40',
      700: '#212529',
    },
    red: {
      status: '#FEBABA',
      statusText: '#F12A2A',
    },
    green: {
      status: '#BAFFC1',
      statusText: '#048221',
    },
    orange: {
      status: '#ffd6a8',
      statusText: '#f8840a',
    },
    gold: '#FDC106',
  },
  shadows: {
    custom: '0px 0px 15px rgba(0, 0, 0, 0.1)',
  },
});

export default theme;
