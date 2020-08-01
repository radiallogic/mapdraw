import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Trips from "./../src/components/Trip/Trips";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const trips = [{ _id: 1, name: "trip1"}, { _id: 1, name: "trip2"} , { _id: 1, name: "trip3"}];

// id={this.state.id}
// name={this.state.name}
const select=jest.fn()
const save=jest.fn()
const savenew=jest.fn()

// it displays not trip selected

if("displays No Trip Selected", () => {

  const wrapper = mount(<Trips trips={trips} id={0} select={select} save={save} savenew={savenew} />)
  expect(wrapper.find('select').props().name).toBe('No Trip Selected')

})

// trip selected updates title
if("trip selected updates title", () => {
  const wrapper = mount(<Trips trips={trips} id={0} select={select} save={save} savenew={savenew} />)
  expect(wrapper.find('select').props().value).toBe('No Trip Selected')

  wrapper.find('select').simulate('change', {target: {value: '1'}})

  expect(wrapper.find('select').props().name).toBe('trip1')
})



it("editing trip changes selected field", () => {
  // Test first render and componentDidMount
  act(() => {
    ReactDOM.render(<Trips trips={trips} id={0} select={select} save={save} savenew={savenew}  />, container);
  });

  const button = container.querySelector('.add');
  //expect(document.title).toBe('You clicked 0 times');

  // Test second render and componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  //selected id should stay the same

  // expect(label.textContent).toBe('You clicked 1 times');
  // expect(document.title).toBe('You clicked 1 times');
});

// adding selected field
it("adding trip changes selected field", () => {
  // Test first render and componentDidMount
  act(() => {
    ReactDOM.render(<Trips trips={trips} id={0} select={select} save={save} savenew={savenew} />, container);
  });

  const button = container.querySelector('.edit');

  // expect(document.title).toBe('You clicked 0 times');

  // Test second render and componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  // selected id should stay change

  // expect(label.textContent).toBe('You clicked 1 times');
  // expect(document.title).toBe('You clicked 1 times');
});


// if another field is changed update trip name field to "save trip" 
it("If id changes set message to Save Trip", () => { 
  // // Test first render and componentDidMount
  // act(() => {
  //   ReactDOM.render(<Trips trips={trips} id={0}  />, container);
  // });

  // const button = container.querySelector('button');
  // const label = container.querySelector('p');
  // expect(label.textContent).toBe('You clicked 0 times');
  // expect(document.title).toBe('You clicked 0 times');

  // // Test second render and componentDidUpdate
  // act(() => {
  //   button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  // });
  // expect(label.textContent).toBe('You clicked 1 times');
  // expect(document.title).toBe('You clicked 1 times');
});