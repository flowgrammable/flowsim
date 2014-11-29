'use strict';

describe('Service: tables', function () {

  // load the service's module
  beforeEach(module('flowsimUiApp'));

  // instantiate service
  var Tables;
  beforeEach(inject(function (_Tables_) {
    Tables = _Tables_;
  }));

  it('Tables profile construction Pass', function () {
    var tblProfile = new Tables.Profile();
  });

  it('Tables profile copy construction', function() {
    var tblProfile = new Tables.Profile();
    tblProfile.n_tables = 100;
    var tbl2 = new Tables.Profile(tblProfile);
    expect(tbl2.n_tables).toBe(100);
  });

  it('Tables profile json construction', function() {
    var tblProfile = new Tables.Profile();
    tblProfile.n_tables = 100;
    var j = JSON.stringify(tblProfile);
    var j_ = new Tables.Profile(JSON.parse(j));
    expect(j_.n_tables).toEqual(tblProfile.n_tables);
  });

  it('Tables profile rebuild', function() {
    var tblProfile = new Tables.Profile();
    expect(tblProfile.tables.length).toBe(8);

    tblProfile.n_tables = 2;
    tblProfile.rebuild();
    expect(tblProfile.tables.length).toBe(2);
    expect(tblProfile.n_tables).toBe(2);
    expect(tblProfile.tables[0].name).toBe('table0');
    expect(tblProfile.tables[1].name).toBe('table1');

    tblProfile.n_tables = 5;
    tblProfile.rebuild();
    expect(tblProfile.tables.length).toBe(5);
    expect(tblProfile.n_tables).toBe(5);
    expect(tblProfile.tables[0].name).toBe('table0');
    expect(tblProfile.tables[4].name).toBe('table4');

  });

});
