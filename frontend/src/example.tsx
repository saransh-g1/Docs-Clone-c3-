
import {Routes, Route,BrowserRouter} from "react-router-dom"
import SignInScreen from './pages/signup';
import {Landing} from "./pages/landing"
import {Login} from "./pages/signin"
import {Dash} from "./pages/dash"
import React, { useState, useCallback } from 'react';

const ChildComponent = ({ onClick }) => {
  console.log('ChildComponent rendering...');
  return <button onClick={onClick}>Click me</button>;
};

const Exmaple= () => {
  const [count, setCount] = useState(0);

  // Regular callback function
  const handleClick = () => {
    console.log('Button clicked!');
    setCount((prevCount) => prevCount + 1);
  };

  // Memoized callback using useCallback
  const memoizedHandleClick = useCallback(handleClick, []);

  return (
    <div>
      <p>Count: {count}</p>
      <ChildComponent onClick={memoizedHandleClick} />
    </div>
  );
};



export default Example;