import React from "react";
import { sortBy } from "lodash";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENTS: (list) => sortBy(list, "num_comments").reverse(),
  POINTS: (list) => sortBy(list, "points").reverse(),
};

const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState("NONE");

  const handleSort = (sortKey) => {
    setSort(sortKey);
  };

  const sortedList = SORTS[sort](list);

  return (
    <>
      <div className="list-header">
        <div style={{ display: "flex" }}>
          <span style={{ width: "40%" }}>
            <button type="button" onClick={() => handleSort("TITLE")}>
              Title
            </button>
          </span>
          <span style={{ width: "30%" }}>
            <button type="button" onClick={() => handleSort("AUTHOR")}>
              Author
            </button>
          </span>
          <span style={{ width: "10%" }}>
            <button type="button" onClick={() => handleSort("COMMENTS")}>
              Comments
            </button>
          </span>
          <span style={{ width: "10%" }}>
            <button type="button" onClick={() => handleSort("POINTS")}>
              Points
            </button>
          </span>
          <span style={{ width: "10%" }}>Actions</span>
        </div>
      </div>

      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </>
  );
};

const Item = ({ item, onRemoveItem }) => (
  <div style={{ display: "flex" }}>
    <span style={{ width: "40%" }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: "30%" }}>{item.author}</span>
    <span style={{ width: "10%" }}>{item.num_comments}</span>
    <span style={{ width: "10%" }}>{item.points}</span>
    <span style={{ width: "10%" }}>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
);

export default List;
