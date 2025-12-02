export function generateSlug(name, id) {
  if (!name) return id;

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 60); // Limit length

  return `${slug}-${id}`;
}

export function extractIdFromSlug(slug) {
  // Extract the MongoDB ID from the end of the slug
  // MongoDB IDs are 24 characters hex
  const match = slug.match(/([a-f0-9]{24})$/i);
  return match ? match[1] : slug;
}
