module.exports = item => {
  // If it's a low-level quest, ignore
  if (item.level.max < 80) { return null }
  // If it's for non-expansion players, ignore
  if (item.required_access) {
    if (item.required_access.condition === 'NoAccess') {
      return null;
    }
  }
  return item.id;
}