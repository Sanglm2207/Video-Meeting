interface Meeting {
    id: string;
    host: string;
    title: string;
    createdAt: Date;
    participants: string[];
    isLocked: boolean;
}

export class MeetingService {
    private meetings = new Map<string, Meeting>();

    createMeeting(host: string, title: string): Meeting {
        const id = this.generateMeetingId();
        const meeting: Meeting = {
            id,
            host,
            title,
            createdAt: new Date(),
            participants: [host],
            isLocked: false
        };
        this.meetings.set(id, meeting);
        return meeting;
    }

    getMeeting(id: string): Meeting | undefined {
        return this.meetings.get(id);
    }

    private generateMeetingId(): string {
        return Math.random().toString(36).substring(2, 10);
    }
}