export interface UserPreferences {
  // Smoking preferences
  allowsSmoking?: boolean;

  // Animal preferences
  allowsAnimals?: boolean;

  // Music preferences
  musicPreference?: 'quiet' | 'moderate' | 'loud' | 'no_preference';

  // Conversation preferences
  conversationLevel?: 'chatty' | 'moderate' | 'quiet' | 'no_preference';

  // Additional custom preferences
  customPreferences?: Record<string, string | boolean | number>;
}

export type CarEnergyType = 'Electric' | 'Hybrid' | 'Gasoline' | 'Diesel';
