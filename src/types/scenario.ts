export interface HouseholdMember {
  name: string
  role: string
  traits: string[]
}

export interface StoryBeat {
  step: number
  text: string
}

export interface Scenario {
  id: string
  title: string
  source: string
  sourceType: 'film' | 'book'
  year: number
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  description: string
  thumbnail?: string
  householdMembers: HouseholdMember[]
  goals: string[]
  storyBeats: StoryBeat[]
}
