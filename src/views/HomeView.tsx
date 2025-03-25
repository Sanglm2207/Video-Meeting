import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getOrCreateUserToken } from "@/utils/authUtils";

export const HomeView = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Ensure user has a token
        getOrCreateUserToken();
    }, []);

    const handleCreateMeeting = () => {
        const meetingId = generateMeetingId();
        navigate(`/meet/${meetingId}`);
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h3" gutterBottom>
            Online Meeting
        </Typography>
        <Button
            variant="contained"
            size="large"
            onClick={handleCreateMeeting}
            sx={{ mt: 4 }}
        >
            Create New Meeting
        </Button>
        </Container>
    );
};

function generateMeetingId(): string {
    return Math.random().toString(36).substring(2, 10);
}
