import Editor from './formats/editor';
import {Routes, Route,BrowserRouter} from "react-router-dom"
import SignInScreen from './pages/signup';
import {Landing} from "./pages/landing"
import {Login} from "./pages/signin"
import {Dash} from "./pages/dash"
import Example from './pages/example';
import { RecoilRoot } from 'recoil';
const App = () => {

  return (
    <RecoilRoot>
    <BrowserRouter>
    <Routes>

    <Route path="/signup" element={<SignInScreen/>}></Route>
    <Route path="/edit/*" element={<Editor></Editor>}></Route>
    <Route path="/landing" element={<Landing></Landing>}></Route>
    <Route path="/login" element={<Login></Login>}></Route>
    <Route path="/dashboard" element={<Dash></Dash>}></Route>
    <Route path="/example" element={<Example></Example>}></Route>
    </Routes>
    </BrowserRouter>
    </RecoilRoot>
   
  );
};

export default App;