import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { HomeView } from './views/HomeView';
import { MeetingView } from './views/MeetingView';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/meet/:meetingId" element={<MeetingView />} />
            </Routes>
        </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;