import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { people_f } from './reducers/people_f';
import { filter_f } from './reducers/filter_f';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/observable/combineLatest';
import 'rxjs/src/operator/combineLatest'
import 'rxjs/add/operator/startWith';


@Component({
  selector: 'people-filter',
  template: `
    <h3>Party Planner</h3>
    <filter-select (updateFilter)='updateFilter($event)'></filter-select>
    <person-input (addPerson)='addPerson($event)'></person-input>
    <person-list
        [people]='people_f | async'
        (addGuest)='addGuest($event)'
        (removeGuest)='removeGuest($event)'
        (removePerson)='removePerson($event)'
        (toggleAttending)='toggleAttending($event)'>
    </person-list>
  `
})
export class PeopleFilterComponent {
  people_f;
  private id = 0;

  constructor(private _store: Store<any>) {
    this.people_f = Observable.merge(
      _store.select('people_f'),
      _store.select('filter_f'),
      (people_f: any[], filter_f) => {
        return people_f.filter(filter_f);
      }
    )
  }

  addPerson(name) {
    this._store.dispatch({
      type: 'ADD_PERSON', payload: {
        id: ++this.id,
        name,
        guests: 0,
        attending: false
      }
    })
  }

  addGuest({ id }) {
    this._store.dispatch({
      type: 'ADD_GUESTS',
      payload: id
    });
  }

  removeGuest({ id }) {
    this._store.dispatch({
      type: 'REMOVE_GUESTS',
      payload: id
    });
  }

  removePerson({ id }) {
    this._store.dispatch({
      type: 'REMOVE_PERSON',
      payload: id
    });
  }

  toggleAttending({ id }) {
    this._store.dispatch({
      type: 'TOGGLE_ATTENDING',
      payload: id
    });
  }

  updateFilter(filter_f) {
    this._store.dispatch({ type: filter_f });
  }
}