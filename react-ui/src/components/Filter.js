import React from 'react'

const Filter = ({ newQuery, setNewQuery }) => {
  const handleQueryChange = (event) => setNewQuery(event.target.value)

  return (
    <div>
      filter shown with <input
        value={newQuery}
        onChange={handleQueryChange}
      />
    </div>
  );
}

export default Filter
