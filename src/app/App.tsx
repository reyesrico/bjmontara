'use client'

import React from 'react';

import BlackJackGame from '@/components/BlackJackGame';

const App = () => {
  return (
    <div>
      <BlackJackGame numberPlayers={2} />
    </div>
  )
};

export default App;