import { Request, Response, Router } from 'express';
import { generateUserToken } from '../utils/authUtils';

const router = Router();

router.get('/quick-join', (req: Request, res: Response) => {
    const token = req.cookies.meetToken || generateUserToken();
    
    res.cookie('meetToken', token, {
        maxAge: 86400000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
    
    res.json({ success: true, token });
});

export { router as authController };