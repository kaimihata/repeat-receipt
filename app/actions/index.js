import { TEST_ACTION, TEST_ACTION2 } from '../constants/ActionTypes';

export function testAction(payload) {
  return { type: TEST_ACTION, payload };
}

export function testAction2(payload) {
  return { type: TEST_ACTION2, payload };
}
