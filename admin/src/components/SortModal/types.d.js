const PropTypes = require('prop-types');

/* Added prop-types validation using `PropTypes` library to help with runtime prop-validation, linting and IDE autocompletion and to define a clear data contract between components. Can be used in conjunction with JsDoc as an alternative using TypeScript. */

export const SortMenuSettingsProps = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  mainField: PropTypes.string,
};

export const SortMenuProps = {
  status: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onOpen: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onShowMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  // settings: PropTypes.shape(SortMenuSettingsProps).isRequired,
};

export const SortableListProps = {
  items: PropTypes.array.isRequired,
  onShowMore: PropTypes.func,
  onSortEnd: PropTypes.func,
  hasMore: PropTypes.bool,
  settings: PropTypes.shape(SortMenuSettingsProps).isRequired,
};

export const SortableItemProps = {
  title: PropTypes.string,
  subtitle: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  sortIndex: PropTypes.number.isRequired,
};
