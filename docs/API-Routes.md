# API Routes (additions)

GET /api/ip → { lat, lon, city, country } (auto-detect if private IP)
GET /api/plants → list (filter, search)
POST /api/plants → create
GET /api/plants/:id → detail
PATCH/DELETE /api/plants/:id

GET /api/categories → list defaults + user
POST /api/categories → create
PATCH/DELETE /api/categories/:id

GET /api/events?from&to&plant&cat → events
POST /api/events
PATCH/DELETE /api/events/:id
