const isEmptyObject = (candidate: Object) => {
  return Object.keys(candidate).length > 0;
};

const isColorChange = ({ added, deleted, updated }) => {
  return (
    !isEmptyObject(added) || isEmptyObject(deleted) || !isEmptyObject(updated)
  );
};

export default isColorChange;
