import { JourneyDocument } from '../schemas/domain.schemas';
export declare class JourneysController {
    private activeJourneys;
    startJourney(body: any): JourneyDocument;
    checkIn(id: string): JourneyDocument;
}
