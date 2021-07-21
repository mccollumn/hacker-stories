import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel,
} from "./App";

describe("Item", () => {
  test("renders all properties", () => {
    render(<Item item={storyOne} />);

    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.getByText("React")).toHaveAttribute(
      "href",
      "https://reactjs.org/"
    );
  });

  test("renders a clickable dismiss button", () => {
    render(<Item item={storyOne} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

const storyOne = {
  title: "React",
  url: "https://reactjs.org/",
  author: "Jordan Walke",
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: "Redux",
  url: "https://redux.js.org/",
  author: "Dan Abramov, Andrew Clark",
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

describe("storiesReducer", () => {
  test("removes a story from all stories", () => {
    const action = { type: "REMOVE_STORY", payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  test("fetches stories init", () => {
    const action = { type: "STORIES_FETCH_INIT" };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: stories,
      isLoading: true,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  test("fetch sotries success", () => {
    const result = { data: { hits: stories } };
    const action = { type: "STORIES_FETCH_SUCCESS", payload: result.data.hits };
    const state = { isLoading: false, isError: false, data: action.payload };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: stories,
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  test("fetch stories failure", () => {
    const action = { type: "STORIES_FETCH_FAILURE" };
    const state = { isLoading: false, isError: true };

    const newState = storiesReducer(state, action);

    const expectedState = {
      isLoading: false,
      isError: true,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});

// import { render, screen } from "@testing-library/react";
// import App from "./App";

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// describe("something truthy and falsy", () => {
//   it("ture to be true", () => {
//     expect(true).toBe(true);
//   });
//   it("false to be false", () => {
//     expect(false).toBeFalsy();
//   });
// });
