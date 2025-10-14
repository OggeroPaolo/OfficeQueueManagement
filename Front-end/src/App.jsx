import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router";
import Header from "./components/Header";
import GetTicket from "./components/GetTicket";
import CounterNextTicket from "./components/CounterNextTicket";
import HomepageDemo from "./components/HomepageDemo";

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route index element={<HomepageDemo />} />
          <Route path='get-ticket' element={<GetTicket />} />
          <Route
            path='counter-next-ticket/:cnt'
            element={<CounterNextTicket />}
          />
        </Route>

        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
