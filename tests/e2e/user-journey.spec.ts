interface UserJourney {
  id: string;
  userId: string;
  applicationId: string;
  steps: JourneyStep[];
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'abandoned';
  validationResults: JourneyValidationResult[];
}

interface JourneyStep {
  stepId: string;
  stepName: string;
  timestamp: Date;
  data: any;
  validationErrors: string[];
  isValid: boolean;
}

interface JourneyValidationResult {
  field: string;
  isValid: boolean;
  errorMessage?: string;
  timestamp: Date;
}

class UserJourneyValidator {
  private journeys: Map<string, UserJourney> = new Map();

  startJourney(userId: string, applicationId: string): string {
    const journeyId = `${userId}-${applicationId}-${Date.now()}`;
    const journey: UserJourney = {
      id: journeyId,
      userId,
      applicationId,
      steps: [],
      startTime: new Date(),
      status: 'in-progress',
      validationResults: []
    };
    
    this.journeys.set(journeyId, journey);
    return journeyId;
  }

  addStep(journeyId: string, stepName: string, data: any): void {
    const journey = this.journeys.get(journeyId);
    if (!journey) return;

    const validationErrors = this.validateStepData(stepName, data);
    const step: JourneyStep = {
      stepId: `${journeyId}-step-${journey.steps.length + 1}`,
      stepName,
      timestamp: new Date(),
      data,
      validationErrors,
      isValid: validationErrors.length === 0
    };

    journey.steps.push(step);
    this.updateValidationResults(journey, step);
  }

  private validateStepData(stepName: string, data: any): string[] {
    const errors: string[] = [];
    
    switch (stepName) {
      case 'personal-info':
        if (!data.firstName) errors.push('First name is required');
        if (!data.lastName) errors.push('Last name is required');
        if (!data.email || !this.isValidEmail(data.email)) errors.push('Valid email is required');
        break;
      case 'contact-details':
        if (!data.phone) errors.push('Phone number is required');
        if (!data.address) errors.push('Address is required');
        break;
      case 'documents':
        if (!data.documents || data.documents.length === 0) errors.push('At least one document is required');
        break;
    }
    
    return errors;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private updateValidationResults(journey: UserJourney, step: JourneyStep): void {
    step.validationErrors.forEach(error => {
      journey.validationResults.push({
        field: step.stepName,
        isValid: false,
        errorMessage: error,
        timestamp: step.timestamp
      });
    });

    if (step.isValid) {
      journey.validationResults.push({
        field: step.stepName,
        isValid: true,
        timestamp: step.timestamp
      });
    }
  }

  completeJourney(journeyId: string): UserJourney | null {
    const journey = this.journeys.get(journeyId);
    if (!journey) return null;

    journey.endTime = new Date();
    journey.status = this.isJourneyValid(journey) ? 'completed' : 'abandoned';
    return journey;
  }

  private isJourneyValid(journey: UserJourney): boolean {
    return journey.steps.every(step => step.isValid);
  }

  getJourneyReport(journeyId: string): JourneyReport | null {
    const journey = this.journeys.get(journeyId);
    if (!journey) return null;

    return {
      journeyId: journey.id,
      userId: journey.userId,
      applicationId: journey.applicationId,
      duration: journey.endTime ? 
        journey.endTime.getTime() - journey.startTime.getTime() : null,
      totalSteps: journey.steps.length,
      validSteps: journey.steps.filter(s => s.isValid).length,
      invalidSteps: journey.steps.filter(s => !s.isValid).length,
      validationErrors: journey.validationResults.filter(r => !r.isValid),
      status: journey.status
    };
  }
}

interface JourneyReport {
  journeyId: string;
  userId: string;
  applicationId: string;
  duration: number | null;
  totalSteps: number;
  validSteps: number;
  invalidSteps: number;
  validationErrors: JourneyValidationResult[];
  status: 'in-progress' | 'completed' | 'abandoned';
}
