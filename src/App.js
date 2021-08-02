import React from "react";
import axios from "axios";
import SearchForm from "./SearchForm";
import List from "./List";

const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PAGE_PARAM = "page=";

const getUrl = (searchTerm, page) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PAGE_PARAM}${page}`;

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data:
          action.payload.page === 0
            ? action.payload.list
            : state.data.concat(action.payload.list),
        page: action.payload.page,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)]);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    page: 0,
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const result = await axios.get(urls[urls.length - 1]);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: { list: result.data.hits, page: result.data.page },
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (searchTerm, page) => {
    setUrls(urls.concat(getUrl(searchTerm, page)));
  };

  const handleSearchSubmit = (event) => {
    handleSearch(searchTerm, 0);
    event.preventDefault();
  };
  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = lastUrl.substring(
      lastUrl.lastIndexOf("query=") + 6,
      lastUrl.lastIndexOf("&")
    );
    handleSearch(searchTerm, stories.page + 1);
  };

  const getLastSearches = (urls) => {
    urls = [...new Set(urls)];
    return urls
      .slice(-6)
      .slice(0, -1)
      .map((url) =>
        url.substring(url.lastIndexOf("query=") + 6, url.lastIndexOf("&"))
      );
  };

  const lastFiveSearchTerms = getLastSearches(urls);

  const handleLastSearch = (term) => {
    setSearchTerm(term);
    handleSearch(term, 0);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <LastSearches
        lastSearches={lastFiveSearchTerms}
        onLastSearch={handleLastSearch}
      />

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      <List list={stories.data} onRemoveItem={handleRemoveStory} />

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <button type="button" onClick={handleMore}>
          More
        </button>
      )}
    </div>
  );
};

const LastSearches = ({ lastSearches, onLastSearch }) => (
  <>
    {lastSearches.map((term, index) => (
      <button key={term + index} onClick={() => onLastSearch(term)}>
        {term}
      </button>
    ))}
  </>
);

export default App;
