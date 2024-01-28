import { patch, N, T } from 'js-sdk-vdom';
import $ from 'jquery';

let step = 1;

$.fn.app = function (state, update, application) {
  let tree = null;
  const target = this[0];

  function render() {
    function dispatch(event) {
      state = update(state, event);
      window.requestAnimationFrame(render);
    }

    tree = patch(tree, application(dispatch, state), target);
  }

  window.requestAnimationFrame(render);
};

$(function() {
  $('#counter').app(
    { count: 0 },
    function reduce(state, event) {
      return { count: state.count + event };
    },
    function (dispatch, { count }) {
      return N('div', {}, {}, [
        T(`Counter ${count}`),
        N('div', {}, {}, [
          N(
            'button',
            {},
            {
              click: function() {
                dispatch(step);
              }
            },
            [T("Increment")]
          ),
          N(
            'button',
            {},
            {
              click: function() {
                dispatch(-step);
              }
            },
            [T("Decrement")]
          )
        ])
      ]);
    }
  );

  const editor = $('#editor');

  editor.on('change', function(e) {
    step = parseInt(e.target.value);
  });

  editor.val(step);
})
