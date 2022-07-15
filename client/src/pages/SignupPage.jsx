import { useState } from 'react'
import { TextField, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router';
 
const SignupPage = ({ onUpdateUser}) => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false); //TODO use react query here
    
    const navigate = useNavigate();
    
    const onStartClicked = async () => {
        // TODO const, use base url, from process env, export to service to wrap api reqs
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userName
                })
            });
            const parsedRes = await res.json();

            onUpdateUser(parsedRes.user);
            navigate('/');
        } catch(err) {
            console.log(err)// TODO handle error
        } finally {
            setLoading(false);
        }
    }

    return <> 
        <Container> 
            <Box  sx={{ m: 10 }} display='flex' flexDirection='column' alignItems='center' justifyContent='center' component='form'>
                <TextField 
                    onChange={e => setUserName(e.target.value)}
                    value={userName}
                    label="Username" 
                    variant="outlined" 
                />
                <Button 
                    type="submit" 
                    onClick={onStartClicked}  
                    sx={{ m: 2 }} 
                    disabled={loading || userName.length === 0} 
                    size="large" variant="contained">{ loading ? 'Loading...' : 'START' }
                </Button>
        </Box >
        </Container>
    </>
}

export default SignupPage;