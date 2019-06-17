import { html } from 'lit-html';

//@@todo - check https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
// vh is not what you expect in android

// memoize eventListener to declare them only once
let onTouchGesture = null;
let onMouseGesture = null;


function platformView(service, globals = {}) {
  // if (!onTouchGesture && !onMouseGesture) {
  //   onTouchGesture = (e) => service.onUserGesture('touch');
  //   onMouseGesture = (e) => service.onUserGesture('mouse');
  // }

  // const values = service.params.getValues();
  // const statusView = [];

  // for (let name in values) {
  //   statusView.push(html`<li>${name}: ${values[name]}</li>`);
  // }

  // console.log(status, globals);

  // if (values.hasAuthorizations && values.interactionType === null) {
  //   return html`
  //     <section
  //       @touchend="${onTouchGesture}"
  //       @mouseup="${onMouseGesture}"
  //     >
  //       <div class="flex-center" style="height: 30vh"></div>
  //       <div class="flex-center" style="height: 50vh">
  //          <ul style="padding: 0; list-style-type: none">${statusView}</ul>
  //       </div>
  //       <div class="flex-middle" style="height: 20vh">click to join</div>
  //     </section>
  //   `;
  // } else {
  //   return html`
  //     <section>
  //       <div class="flex-center" style="height: 30vh"></div>
  //       <div class="flex-center" style="height: 50vh">
  //          <ul style="padding: 0; list-style-type: none">${statusView}</ul>
  //       </div>
  //       <div class="flex-middle" style="height: 20vh"></div>
  //     </section>
  //   `;
  // }

  return html`<p>Hello</p>`;
}

export default platformView;
