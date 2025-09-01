# Data Model (min viable)

## Plant

- \_id: ObjectId
- name: string (required, unique per user or global)
- commonNames: [string]
- categoryId: ObjectId | null
- description: string
- images: [url]
- lifecycle: { annual|perennial|biennial }
- sowing: { indoor: [months], outdoor: [months], notes: string }
- transplant: { months: [months], notes: string }
- harvest: { months: [months], notes: string }
- hardiness: { minTempC?: number }
- createdBy: userId | 'system'
- createdAt, updatedAt

## Category

- \_id
- name: string (e.g., Leafy, Fruiting, Root, Herbs)
- color?: string
- createdBy: userId | 'system'

## Event

- \_id
- userId
- plantId?: ObjectId
- categoryId?: ObjectId
- title: string
- date: ISO string (all-day)
- notes?: string
- tags?: [string]

## User (adds)

- locationPreference: 'profile'|'ip'
- coordsSource: 'auto'|'manual'|null
- latitude, longitude, koppen_geiger_zone, zone_description
