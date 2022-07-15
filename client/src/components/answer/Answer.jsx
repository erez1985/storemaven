import { Box } from '@mui/material';

const Answer = ( { answer }) => {
    return <Box sx={{ m: 2 }} display='flex'>
        <span style={{
            display: answer ? 'block' : 'hidden',
            fontSize: '40px',
            ...answer?.style
        }}>{answer.text}</span>
    </Box>
}

export default Answer;