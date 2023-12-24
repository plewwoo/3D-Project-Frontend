import HomePage from "./page/home.js";
import Navbar from "./components/navbar.js";

function App() {
    return (
        <div className="App">
            {<Navbar />}
            {<HomePage />}
        </div>
    );
}

export default App;
