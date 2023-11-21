import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import AllTweets from "./pages/AllTweets";
import MyTweets from "./pages/MyTweets";
import { useAuth } from "./context/AuthContext";

function App({ tweetService }) { 
  return (
    <div className="app">
      <Router>
        <RoutesWithNavigation tweetService={tweetService} />
      </Router>
    </div>
  );
}

function RoutesWithNavigation({ tweetService }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onAllTweets = () => {
    navigate("/");
  };

  const onMyTweets = () => {
    navigate(`/${user.username}`);
  };

  const onLogout = () => {
    if (window.confirm("Do you want to log out?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <>
      <Header
        username={user?.username}
        onLogout={onLogout}
        onAllTweets={onAllTweets}
        onMyTweets={onMyTweets}
      />
      <Routes>
        <Route path="/" element={<AllTweets tweetService={tweetService} />} />
        <Route path="/:username" element={<MyTweets tweetService={tweetService} />} />
      </Routes>
    </>
  );
}

export default App;
