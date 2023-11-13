'use client'

import React from 'react';

import BlackJackGame from '@/components/BlackJackGame';

const App = () => {
  return (
    <div>
      <BlackJackGame numberPlayers={3} />
    </div>
  )
};

export default App;