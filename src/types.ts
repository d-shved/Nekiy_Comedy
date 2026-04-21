export interface ComedyEvent {
    id: string
    type: 'show' | 'open-mic'
    title: string
    date: string
    time: string
    venue: string
    description: string
    createdAt: string
}
