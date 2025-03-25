import { MeetingService } from '@/services/MeetingService';
import { Request, Response, Router } from 'express';

const router = Router();
const meetingService = new MeetingService();

router.post('/', (req: Request, res: Response) => {
    const { userId, title } = req.body;
    const meeting = meetingService.createMeeting(userId, title);
    res.json(meeting);
});

router.get('/:id', (req: Request, res: Response) => {
    const meeting = meetingService.getMeeting(req.params.id);
    if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json(meeting);
});

export { router as meetingController };