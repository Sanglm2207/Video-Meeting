import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import Peer from 'peerjs';
import { getOrCreateUserToken } from '@/utils/authUtils';

const WS_URL = import.meta.env.VITE_WS_URL;

export const MeetingView = () => {
    const { meetingId } = useParams();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [mediaState, setMediaState] = useState({
        video: false,
        audio: false,
        screen: false
    });
    const peerRef = useRef<Peer | null>(null);
    const [userId] = useState(getOrCreateUserToken());

    useEffect(() => {
        const initMeeting = async () => {
            try {
                // Initialize media devices
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Initialize PeerJS connection
                const peer = new Peer(userId);
                peerRef.current = peer;

                console.log("Connecting to WebSocket at:", WS_URL);
                const ws = new WebSocket(
                    `${WS_URL}?meetingId=${meetingId}&userId=${userId}`
                );

                // Handle incoming calls
                peer.on("call", (call) => {
                    call.answer(stream);
                    call.on("stream", (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                    });
                });

                ws.onopen = () => {
                    console.log("WebSocket connected successfully");
                };

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    // Handle signaling messages
                    console.log("WebSocket message received:", data);
                };

                ws.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };

                ws.onclose = () => {
                    console.log("WebSocket connection closed");
                };

            } catch (error) {
                console.error("Error initializing meeting:", error);
            }
        };

        initMeeting();

        return () => {
        // Cleanup
        if (peerRef.current) {
            peerRef.current.destroy();
        }
        };
    }, [meetingId, userId]);

    const toggleMedia = async (type: 'video' | 'audio') => {
        const stream = localVideoRef.current?.srcObject as MediaStream;
        if (!stream) return;

        if (type === 'video') {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setMediaState(prev => ({ ...prev, video: videoTrack.enabled }));
        }
        } else if (type === 'audio') {
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setMediaState(prev => ({ ...prev, audio: audioTrack.enabled }));
        }
        }
    };

    return (
        <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
            Meeting: {meetingId}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Remote Video</Typography>
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{ width: '100%', backgroundColor: '#333' }}
            />
            </Box>
            <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Your Video</Typography>
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{ width: '100%', backgroundColor: '#333' }}
            />
            </Box>
        </Box>
        
        <Stack direction="row" spacing={2} justifyContent="center">
            <Button
            variant="contained"
            color={mediaState.video ? 'primary' : 'error'}
            onClick={() => toggleMedia('video')}
            >
            {mediaState.video ? 'Turn Off Camera' : 'Turn On Camera'}
            </Button>
            <Button
            variant="contained"
            color={mediaState.audio ? 'primary' : 'error'}
            onClick={() => toggleMedia('audio')}
            >
            {mediaState.audio ? 'Mute' : 'Unmute'}
            </Button>
        </Stack>
        </Box>
    );
};