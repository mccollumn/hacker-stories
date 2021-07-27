import React from "react";
import { sortBy } from "lodash";
import { ReactComponent as SortUp } from "./sort-up.svg";
import { ReactComponent as SortDown } from "./sort-down.svg";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENTS: (list) => sortBy(list, "num_comments").reverse(),
  POINTS: (list) => sortBy(list, "points").reverse(),
};

const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState({ sortKey: "NONE", isReverse: false });

  const handleSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse });
  };

  const sortedList = sort.isReverse
    ? SORTS[sort.sortKey](list).reverse()
    : SORTS[sort.sortKey](list);

  return (
    <>
      <div className="list-header">
        <div style={{ display: "flex" }}>
          <span style={{ width: "40%" }}>
            <button type="button" onClick={() => handleSort("TITLE")}>
              Title
              <SortArrow
                isReverse={sort.sortKey === "TITLE" && sort.isReverse}
              />
            </button>
          </span>
          <span style={{ width: "30%" }}>
            <button type="button" onClick={() => handleSort("AUTHOR")}>
              Author
              <SortArrow
                isReverse={sort.sortKey === "AUTHOR" && sort.isReverse}
              />
            </button>
          </span>
          <span style={{ width: "12%" }}>
            <button type="button" onClick={() => handleSort("COMMENTS")}>
              Comments
              <SortArrow
                isReverse={sort.sortKey === "COMMENTS" && sort.isReverse}
              />
            </button>
          </span>
          <span style={{ width: "8%" }}>
            <button type="button" onClick={() => handleSort("POINTS")}>
              Points
              <SortArrow
                isReverse={sort.sortKey === "POINTS" && sort.isReverse}
              />
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
    <span style={{ width: "12%" }}>{item.num_comments}</span>
    <span style={{ width: "8%" }}>{item.points}</span>
    <span style={{ width: "10%" }}>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
);

const SortArrow = ({ isReverse }) =>
  isReverse ? (
    <SortUp height="12px" width="12px" />
  ) : (
    <SortDown height="12px" width="12px" />
  );

export default List;
