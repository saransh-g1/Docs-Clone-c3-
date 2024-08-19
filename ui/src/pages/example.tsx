
import {Routes, Route,BrowserRouter} from "react-router-dom"

import React, { useState, useCallback, useMemo } from 'react';

const ChildComponent = ({ onClick }:{onClick:any}) => {
  console.log('ChildComponent rendering...');
  return <button onClick={onClick}>Click me</button>;
};

const Example= () => {
  const [count, setCount] = useState(0);

  // Regular callback function
  const handleClick = () => {
    console.log('Button clicked!');
    setCount( count + 1);
  
  };

  // Memoized callback using useCallback
  const memoizedHandleClick = useCallback(handleClick, []);

  return (
    <div>
      <p>Count: {count}</p>
      <ChildComponent onClick={handleClick} />
    </div>
  );
};



export default Example;