import {
  ChakraProvider, theme
} from '@chakra-ui/react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Signin from './pages/Signin';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
