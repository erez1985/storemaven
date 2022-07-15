import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import GamePage from './pages/GamePage';

function App() {
	const [user, setUser] = useState(null) // we can persist from local storage 

	const onGameAnswer = async (answer) => {
		try {
			await fetch('http://localhost:3001/' + user + '/answer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					answer
				})
			});

		} catch(err) {
			console.log(err) // TODO handle error
		}
	}
	return (
		<>
		<BrowserRouter>
			<Routes>
				<Route path='/signup' element={<SignupPage onUpdateUser={setUser} />} />
				<Route path='/' element={user ? <GamePage user={user} onAnswer={onGameAnswer} /> : <Navigate to='/signup' />} />
			</Routes>
		</BrowserRouter>

		</>
	);
}

export default App;
