import React from "react";
import ReactDOM from 'react-dom';
import { unmountComponentAtNode } from "react-dom"; // render

import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { act, Simulate } from "react-dom/test-utils";

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

const trips = [{ _id: 1, name: "trip1"}, { _id: 2, name: "trip2"} , { _id: 3, name: "trip3"}];


it("displays No Trip Selected", () => {

  act(() => {
    render(<Trips trips={trips} id={0} select={jest.fn()} save={jest.fn()} savenew={jest.fn()}  />, container);
  });
  
  expect(screen.getByRole('listbox').value ).toBe('No Trip Loaded') ;

});

it("updates title when selecting trip", () => {
  const mockselect = jest.fn();

  const { getByTestId, rerender } =  render(<Trips trips={trips} id={0} select={mockselect} save={jest.fn()} savenew={jest.fn()}  />, container);

  userEvent.selectOptions( screen.getByRole('listbox') , '3');

  // The function was called exactly once
  expect(mockselect.mock.calls.length).toBe(1);
  // The first arg of the first call to the function was 'first arg'
  expect(mockselect.mock.calls[0][0]).toBe('3');

  rerender(<Trips trips={trips} select={jest.fn()} save={jest.fn()} savenew={jest.fn()} id='3' />, container);

  //expect(screen.getByRole('listbox').value ).toBe('3') ;
  expect(screen.getByText('trip3').selected).toBe(true)
})

it("editing trip changes selected field", () => {
  const mockselect = jest.fn();
  const mocksave = jest.fn();
  const mocksavenew = jest.fn();

  act(() => {
    render(<Trips trips={trips} select={jest.fn()} save={mocksave} savenew={mocksavenew} id="3" />, container);
  });

  const editbutton = document.getElementById('edit');
  
  act(() => {
    editbutton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  const input = document.getElementById('trip-input');
  expect(input.value).toBe('trip3');
  userEvent.type(input, ' editied')
  
  const savebutton = document.getElementById('save');
  act(() => {
    savebutton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  expect(mocksavenew.mock.calls.length).toBe(0);
  expect(mocksave.mock.calls.length).toBe(1);

  expect(mocksave.mock.calls[0][0]).toBe('trip3 editied');
});

it("adding trip changes selected field", () => {

  const mocksave = jest.fn();
  const mocksavenew = jest.fn();

  act(() => {
    render(<Trips trips={trips} select={jest.fn()} save={mocksave} savenew={mocksavenew} id="3" />, container);
  });

  const addbutton = document.getElementById('add');
  
  act(() => {
    addbutton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  const input = document.getElementById('trip-input');
  expect(input.value).toBe('');
  userEvent.type(input, 'newtrip')
  
  const savebutton = document.getElementById('save');
  act(() => {
    savebutton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  expect(mocksavenew.mock.calls.length).toBe(1);
  expect(mocksave.mock.calls.length).toBe(0);

  expect(mocksavenew.mock.calls[0][0]).toBe('newtrip');

});

// if another field is changed update trip name field to "save trip" 
it("id changes to id not in trips, set to save trip", () => { 

  render(<Trips trips={trips} select={jest.fn()} save={jest.fn()} savenew={jest.fn()} id='6' />, container);

  expect(screen.getByRole('listbox').value ).toBe('Save Trip') ;

});


