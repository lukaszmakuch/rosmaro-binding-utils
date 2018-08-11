import {targetedActions} from './../';

describe('targeted actions', () => {

  describe('targeting a node', () => {
    
    const baseHandler = ({action, node, virtually, anything, toNode}) => ({
      'hit by': {action, node, virtually, anything},
      'it can produce': toNode({type: 'A PRIVATE ACTION', payload: ':)'})
    });

    const handler = targetedActions()(baseHandler);

    it('calls a node when it is targeted by the action', () => {
      expect(
        handler({
          action: {type: 'TARGETED', target: 'main:a:b:c'},
          node: {id: 'main:a:b:c'},
          virtually: 7,
          anything: 42
        })
      ).toEqual({
        'hit by': {
          action: {type: 'TARGETED', target: 'main:a:b:c'},
          node: {id: 'main:a:b:c'},
          virtually: 7,
          anything: 42
        },
        'it can produce': {
          target: 'main:a:b:c',
          type: 'A PRIVATE ACTION',
          payload: ':)',
        }
      });
    });

    it('calls the parent of a node targeted by the action', () => {
      expect(
        handler({
          action: {type: 'TARGETED', target: 'main:a:b:c'},
          node: {id: 'main:a'},
          virtually: 7,
          anything: 42
        })
      ).toEqual({
        'hit by': {
          action: {type: 'TARGETED', target: 'main:a:b:c'},
          node: {id: 'main:a'},
          virtually: 7,
          anything: 42
        },
        'it can produce': {
          target: 'main:a',
          type: 'A PRIVATE ACTION',
          payload: ':)',
        }
      });
    });

    it('returns an empty result when the node is not targeted by the action', () => {
      expect(
        handler({
          action: {type: 'TARGETED', target: 'main:a:b:d'},
          node: {id: 'main:a:b:c'},
          context: {everything: 42}
        })
      ).toEqual({
        context: {everything: 42},
        arrows: [],
        result: undefined
      });
    });

    it('calls a node when the action does not target any node', () => {
      expect(
        handler({
          action: {type: 'NOT_TARGETED'},
          node: {id: 'main:a:b:c'},
          virtually: 7,
          anything: 42
        })
      ).toEqual({
        'hit by': {
          action: {type: 'NOT_TARGETED'},
          node: {id: 'main:a:b:c'},
          virtually: 7,
          anything: 42
        },
        'it can produce': {
          target: 'main:a:b:c',
          type: 'A PRIVATE ACTION',
          payload: ':)',
        }
      });
    });

  });

});