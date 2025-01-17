import React from "react";
import TestRenderer from "react-test-renderer";

import { MonoText } from "../StyledText";

it(`renders correctly`, () => {
  const testRenderer = TestRenderer.create(<MonoText>Snapshot test!</MonoText>);
  const tree = testRenderer.toJSON();

  expect(tree).toMatchSnapshot();
});
