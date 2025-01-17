import React, { useState } from "react";
import { Text, View } from "react-native";
import { fireEvent, render, act } from "@testing-library/react-native";
import DraggableFlatList from "../src/index";

// Increase jest timeout
jest.setTimeout(10000);

// Mock reanimated
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

const DummyFlatList = (props) => {
  const [data] = useState([
    { id: "1", name: "item 1" },
    { id: "2", name: "item 2" },
  ]);

  return (
    <DraggableFlatList
      keyExtractor={(item) => item.id}
      renderItem={({ item, drag }) => (
        <View onLongPress={drag}>
          <Text>{item.name}</Text>
        </View>
      )}
      testID="draggable-flat-list"
      data={data}
      {...props}
    />
  );
};

describe("DraggableFlatList", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const setup = (propOverrides) => {
    return render(<DummyFlatList {...propOverrides} />);
  };

  it("calls onDragBegin with the index of the element when the drag starts", async () => {
    const mockOnDragBegin = jest.fn();
    const { getByText } = setup({ onDragBegin: mockOnDragBegin });

    // Single act wrapper for all async operations
    await act(async () => {
      fireEvent(getByText("item 1"), "longPress");
      jest.advanceTimersByTime(1000);
    });

    expect(mockOnDragBegin).toHaveBeenCalledWith(0);
  });

  it("renders a placeholder when renderPlaceholder is defined", async () => {
    const renderPlaceholder = () => <View testID="some-placeholder" />;
    const { getByText, getByTestId } = setup({
      renderPlaceholder,
    });

    await act(async () => {
      fireEvent(getByText("item 1"), "longPress");
      jest.advanceTimersByTime(1000);
    });

    expect(getByTestId("some-placeholder")).toBeDefined();
  });
});
