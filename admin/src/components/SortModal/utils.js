// Moved the two functions out of the `SortableItem` component to maintain a static reference to it so that the functions aren't recreated on every render of `SortableItem`. Also for readability, extensability and testability.
// Get subtitle from entry if defined in settings
export function getSubtitle(entry, subTitleField, titleField) {
  try {
    if (subTitleField && entry[subTitleField]) {
      if (entry[subTitleField].constructor.name == 'Array') {
        if (entry[subTitleField].length > 0)
          return ` - ${entry[subTitleField][0][titleField]}`;
      } else if (typeof entry[subTitleField] === 'object') {
        return ` - ${entry[subTitleField][titleField]}`;
      } else {
        return ` - ${entry[subTitleField]}`;
      }
    }
    return '';
  } catch (e) {
    console.log('Unsupported subtitle field value.', e);
    return '';
  }
}

export function getTitle(entry, titleField, mainField) {
  const title = entry[titleField] ? entry[titleField] : entry[mainField];
  return title?.toString();
}
