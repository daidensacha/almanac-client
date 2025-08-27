import { toIsoDateStringOrNull } from '@/utils/dateHelpers';

// --- Category ---
export function normalizeCategory(raw = {}) {
  return {
    _id: String(raw._id || ''),
    category_name: raw.category_name || raw.category || '',
    description: raw.description || '',
    archived: Boolean(raw.archived),
    created_by: raw.created_by ? String(raw.created_by) : null,
    created_at: raw.created_at ? new Date(raw.created_at) : null,
    updated_at: raw.updated_at ? new Date(raw.updated_at) : null,
  };
}

export function serializeCategory(cat) {
  return {
    category_name: cat.category_name?.trim(),
    description: cat.description?.trim() || undefined,
    archived: cat.archived ?? false,
  };
}

// --- Plant ---
const toDate = (v) => (v ? new Date(v) : null);

export function normalizePlant(raw = {}) {
  return {
    _id: String(raw._id || ''),
    common_name: (raw.common_name || '').trim(),
    botanical_name: (raw.botanical_name || '').trim(),

    sow_at: toDate(raw.sow_at),
    plant_at: toDate(raw.plant_at),
    harvest_at: toDate(raw.harvest_at),
    harvest_to: toDate(raw.harvest_to),

    spacing: (raw.spacing || '').trim(),
    depth: (raw.depth || '').trim(),
    fertilise: (raw.fertilise || '').trim(),
    fertiliser_type: (raw.fertiliser_type || '').trim(),
    notes: (raw.notes || '').trim(),

    archived: Boolean(raw.archived),
    created_by: raw.created_by ? String(raw.created_by) : null,
    created_at: toDate(raw.created_at || raw.createdAt),
    updated_at: toDate(raw.updated_at || raw.updatedAt),
  };
}

export function serializePlant(v = {}) {
  const trimOrEmpty = (s) => (s === '' ? '' : (s ?? '').toString().trim() || '');
  const isoOrNull = (d) => (d ? toIsoDateStringOrNull(d) : null);

  return {
    common_name: trimOrEmpty(v.common_name),
    botanical_name: trimOrEmpty(v.botanical_name),
    fertilise: trimOrEmpty(v.fertilise),
    fertiliser_type: trimOrEmpty(v.fertiliser_type),
    spacing: trimOrEmpty(v.spacing),
    depth: trimOrEmpty(v.depth),
    notes: trimOrEmpty(v.notes),
    sow_at: isoOrNull(v.sow_at),
    plant_at: isoOrNull(v.plant_at),
    harvest_at: isoOrNull(v.harvest_at),
    harvest_to: isoOrNull(v.harvest_to),
    archived: v.archived ?? false,
  };
}

// If normalizeCategory/normalizePlant are in THIS SAME FILE, make sure they
// appear above normalizeEvent and REMOVE the import below.
// If they are in a DIFFERENT file, UNCOMMENT the import below and adjust path.
// import { normalizeCategory, normalizePlant } from '@/utils/normalizers';

export function normalizeEvent(raw = {}) {
  // Always surface *_id as strings for forms
  const category_id = raw?.category?._id ?? raw?.category_id ?? raw?.category ?? '';
  const plant_id = raw?.plant?._id ?? raw?.plant_id ?? raw?.plant ?? '';

  return {
    _id: String(raw._id || ''),
    event_name: raw.event_name || '',
    description: raw.description || '',
    occurs_at: raw.occurs_at ? new Date(raw.occurs_at) : null,
    occurs_to: raw.occurs_to ? new Date(raw.occurs_to) : null,
    repeat_cycle: raw.repeat_cycle || '',
    repeat_frequency: raw.repeat_frequency ?? '',
    notes: raw.notes || '',

    // Keep populated objects if present for detail views; else null
    category: raw?.category && raw.category._id ? normalizeCategory(raw.category) : null,
    plant: raw?.plant && raw.plant._id ? normalizePlant(raw.plant) : null,

    // Always expose normalized ids for selects
    category_id: category_id ? String(category_id) : '',
    plant_id: plant_id ? String(plant_id) : '',

    archived: !!raw.archived,
    created_by: raw.created_by ? String(raw.created_by) : null,
    created_at: raw.created_at ? new Date(raw.created_at) : null,
    updated_at: raw.updated_at ? new Date(raw.updated_at) : null,
  };
}

export function serializeEvent(ev = {}) {
  const iso = (d) => toIsoDateStringOrNull(d);

  return {
    event_name: ev.event_name?.trim(),
    description: ev.description?.trim() || undefined,
    occurs_at: iso(ev.occurs_at),
    occurs_to: iso(ev.occurs_to),
    repeat_cycle: ev.repeat_cycle || undefined,
    repeat_frequency: ev.repeat_frequency ?? undefined,
    notes: ev.notes?.trim() || undefined,

    // Send *_id to backend; backend maps to refs
    category_id: ev.category_id || ev.category?._id || undefined,
    plant_id: ev.plant_id || ev.plant?._id || undefined,

    archived: ev.archived ?? false,
  };
}
